const { memory: { redis }, jwt: jwtConfig } = require('~/config/app');
const { user: userEnum } = require('~/config/enum');
const { auth: authError } = require('~/config/error');
const { randomNumber, uniqueId, jwt } = require('~/lib/crypto');
const { httpInvariant } = require('~/lib/error');
const Joi = require('~/lib/validate');
const userModel = require('~/model/user');
const authService = require('~/service/auth');
const smsService = require('~/service/sms');
const mw = require('~/server/middleware');

const LOGIN_TOKEN_PREFIX = 'usr:login';
const REGISTER_TOKEN_PREFIX = 'usr:register';
const properties = {
  user: ['key', 'phoneNumber', 'status']
};

module.exports = router => {
  const verifyPhoneNumberSchema = Joi.object().keys({
    phoneNumber: Joi.phoneNumber().mobile().required()
  });

  router.post('/auth/phone-number/verify', async ctx => {
    const { phoneNumber } = Joi.attempt(ctx.request.body, verifyPhoneNumberSchema);

    smsService.sendVerificationCode(phoneNumber, randomNumber(4));

    ctx.bodyOk(true);
  });

  const checkPhoneNumberSchema = Joi.object().keys({
    phoneNumber: Joi.phoneNumber().mobile().required(),
    code: Joi.string().length(4).required()
  });

  router.post('/auth/phone-number/check', async ctx => {
    const { phoneNumber, code } = Joi.attempt(ctx.request.body, checkPhoneNumberSchema);

    // Verify phone number
    smsService.verifyPhoneNumber(phoneNumber, code);

    // Get user by phoneNumber
    const user = userModel.getUserByPhoneNumber(phoneNumber, ['status']);

    // Generate verification token
    const verificationToken = uniqueId();

    if (user) {
      // TODO: Save to redis
      // Save login token
      redis.push({ [`${LOGIN_TOKEN_PREFIX}:${phoneNumber}`]: verificationToken });
    } else {
      // TODO: Save to redis
      // Save registeration token
      redis.push({ [`${REGISTER_TOKEN_PREFIX}:${phoneNumber}`]: verificationToken });
    }

    ctx.bodyOk({
      status: !!user ? user.status : userEnum.status.preregister,
      verificationToken
    });
  });

  const loginSchema = Joi.object().keys({
    phoneNumber: Joi.phoneNumber().mobile().required(),
    verificationToken: Joi.string().required()
  });

  router.post('/auth/login', async ctx => {
    const { phoneNumber, verificationToken } = Joi.attempt(ctx.request.body, loginSchema);

    // TODO: Read from redis
    // Check verification code
    const isValid = redis.find(i => i[`${LOGIN_TOKEN_PREFIX}:${phoneNumber}`] === verificationToken);

    httpInvariant(isValid, ...authError.invalidVerificationToken);

    // Get user by phoneNumber
    const user = userModel.getUserByPhoneNumber(phoneNumber, ['key', 'status']);

    // Create new token
    const { token, refreshToken, jwtid: jti } = await authService.createToken(user.key);

    ctx.bodyOk({
      key: user.key,
      token,
      refreshToken,
      jti
    });
  });

  const registerSchema = Joi.object().keys({
    phoneNumber: Joi.phoneNumber().mobile().required(),
    verificationToken: Joi.string().required(),
    name: Joi.string().required()
  });

  router.post('/auth/register', async ctx => {
    const {
      name,
      phoneNumber,
      verificationToken
    } = Joi.attempt(ctx.request.body, registerSchema);

    // TODO: Read from redis
    // Check verification code
    const isValid = redis.find(i => i[`${REGISTER_TOKEN_PREFIX}:${phoneNumber}`] === verificationToken);

    httpInvariant(isValid, ...authError.invalidVerificationToken);

    const user = userModel.create({ phoneNumber, name, status: userEnum.status.active });

    // Create new token
    const { token, refreshToken, jwtid: jti } = await authService.createToken(user.key);

    ctx.bodyOk({
      key: user.key,
      token,
      refreshToken,
      jti
    });
  });

  const refreshTokenSchema = Joi.object().keys({
    refreshToken: Joi.string().required().trim()
  });

  router.post('/auth/refresh-token', mw.auth(), async ctx => {
    const { refreshToken: rt } = Joi.attempt(ctx.request.body, refreshTokenSchema);
    const user = ctx.state.user;

    // Decode token when user's token has been expired
    const token = authService.parseAuthorizationHeader(ctx.get('authorization'));
    const decodedToken = jwt.decode(token);

    if (!user) {
      // Check if token is valid or not
      const isValid = await tokenModel.checkAuthToken(decodedToken.sub, decodedToken.jti);

      httpInvariant(isValid, ...authError.unauthorized);

      ctx.state.user = { key: decodedToken.sub };
    }

    // Parse refresh token
    const refreshToken = rt.split(' ');

    httpInvariant(
      refreshToken.length === 2 &&
      refreshToken[0] === 'Bearer' &&
      refreshToken[1],
      ...authError.invalidRefreshToken);

    // Verify refresh token
    const res = await jwt.verify(refreshToken[1], { maxAge: jwtConfig.refreshTokenMaxAge });

    // Check if refresh token and token belongs to the same user
    httpInvariant(res.sub === ctx.state.user.key, ...authError.invalidRefreshToken);

    // Create new token
    const { token: signedToken } = await authService.createToken(res.sub, {
      authRefreshToken: res.rto,
      jti: decodedToken.jti
    });

    ctx.bodyOk({ token: signedToken });
  });

  router.get('/auth/authorize', mw.auth(), async ctx => {
    const userKey = ctx.state.user.key;

    const user = userModel.getByKey(userKey, properties.user);

    ctx.bodyOk({ ...user, jti: ctx.state.user.jti });
  });
};
