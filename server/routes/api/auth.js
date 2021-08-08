const { user: userEnum } = require('~/config/enum');
// const { auth: authError } = require('~/config/error');
const { randomNumber } = require('~/lib/crypto');
// const { httpInvariant } = require('~/lib/error');
const Joi = require('~/lib/validate');
const userModel = require('~/model/user');
const authService = require('~/service/auth');
const smsService = require('~/service/sms');

const properties = {
  user: ['key', 'name', 'phoneNumber', 'state']
};

module.exports = router => {
  const loginSchema = Joi.object().keys({
    phoneNumber: Joi.phoneNumber().mobile().required()
  });

  router.post('/auth/login', async ctx => {
    const { phoneNumber } = Joi.attempt(ctx.request.body, loginSchema);

    smsService.sendVerificationCode(phoneNumber, randomNumber(4));

    ctx.bodyOk(true);
  });

  const verifyPhoneNumberSchema = Joi.object().keys({
    phoneNumber: Joi.phoneNumber().mobile().required(),
    code: Joi.string().length(4).required()
  });

  router.post('/auth/phone-number/verify', async ctx => {
    const { phoneNumber, code } = Joi.attempt(ctx.request.body, verifyPhoneNumberSchema);

    // Verify phone number
    smsService.verifyPhoneNumber(phoneNumber, code);

    let user;
    // Get user by phoneNumber
    user = userModel.getUserByPhoneNumber(phoneNumber, properties.user);

    if (!user) {
      // Register new user
      user = userModel.create({ phoneNumber, status: userEnum.status.preregister });
    }

    const { token, refreshToken, jwtid: jti } = await authService.createToken(user.key);

    ctx.bodyOk({
      key: user.key,
      status: user.status,
      token,
      refreshToken,
      jti
    });
  });
};
