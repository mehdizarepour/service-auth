const { auth: authError } = require('~/config/error');
const { httpInvariant } = require('~/lib/error');
const { randomBytes, jwt } = require('~/lib/crypto');
const tokenModel = require('~/model/token');

/**
 *  Create jwt token
 * @param {String}  key User key
 * @param {Boolean} refreshToken
 * @returns {Object}
 */
exports.createToken = async (key, { authRefreshToken, jti } = {}) => {
  const jwtid = randomBytes(32).toString('hex');

  // Refresh token
  if (authRefreshToken) {
    const token = await tokenModel.checkAuthRefreshToken(key, authRefreshToken);

    httpInvariant(token, ...authError.invalidRefreshToken);

    const newtoken = await jwt.sign({}, { subject: key, jwtid: jti });

    return { token: newtoken };
  }

  const rto = randomBytes(32).toString('hex');
  const data = { authJwtid: jwtid, userKey: key, authRefreshToken: rto };

  // New refresh token
  const refreshTokenSign = await jwt.sign({ rto }, { subject: key });

  await tokenModel.create(data);

  const token = await jwt.sign({}, { subject: key, jwtid });

  return { token, refreshToken: refreshTokenSign, jwtid };
};

/**
 * Parse authorization header
 * @param {Object} authorizationHeader
 * @returns {String}
 */
exports.parseAuthorizationHeader = authorizationHeader => {
  httpInvariant(authorizationHeader, ...authError.unauthorized);

  const token = authorizationHeader.split(' ');

  httpInvariant(token.length === 2 && token[0] === 'Bearer' && token[1], ...authError.unauthorized);

  return token[1];
};
