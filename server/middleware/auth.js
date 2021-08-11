const appConfig = require('~/config/app');
const { auth: authError, user: userError } = require('~/config/error');
const { user: userEnum } = require('~/config/enum');
const { jwt } = require('~/lib/crypto');
const { httpInvariant, HttpError } = require('~/lib/error');
const authService = require('~/service/auth');
const userModel = require('~/model/user');
const tokenModel = require('~/model/token');

const TOKEN_EXPIRED_ERROR_CODE = 'tokenHasBeenExpired';

module.exports = () => async (ctx, next) => {
  const token = authService.parseAuthorizationHeader(ctx.get('authorization'));

  try {
    const res = await jwt.verify(token, { maxAge: appConfig.jwt.tokenMaxAge });

    httpInvariant(res.sub && res.jti, ...authError.unauthorized);

    // Check if token is valid or not
    const isValid = await tokenModel.checkAuthToken(res.sub, res.jti);

    httpInvariant(isValid, ...authError.unauthorized);

    const user = await userModel.getByKey(res.sub, ['status']);

    ctx.state.user = { key: res.sub, status: user.status, jti: res.jti };

    httpInvariant(
      user.status === userEnum.status.active,
      ...userError.userIsNotActive
    );

  } catch (err) {
    if (
      err instanceof HttpError &&
      err.code === TOKEN_EXPIRED_ERROR_CODE &&
      ctx.method === 'POST' &&
      ctx._matchedRoute === '/api/auth/refresh-token'
    ) {
      return next();
    }

    throw err;
  }

  return next();
};
