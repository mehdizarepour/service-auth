const crypto = require('crypto');
const { promisify } = require('util');
const base64Url = require('base64-url');
const jwt = require('jsonwebtoken');
const { nanoid, customAlphabet } = require('nanoid');

const appConfig = require('~/config/app');
const { auth: authError } = require('~/config/error');
const error = require('~/lib/error');

exports.randomNumber = len => {
  const alphabet = '0123456789';
  const randomId = customAlphabet(alphabet, len);

  return randomId();
};

exports.randomString = len => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomId = customAlphabet(alphabet, len);

  return randomId();
};

exports.randomUsernameGenerator = len => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const randomId = customAlphabet(alphabet, len);

  return randomId();
};

exports.uniqueId = () => nanoid();

const base64 = exports.base64 = base64Url;

const randomBytes = exports.randomBytes = crypto.randomBytes;

const hash = exports.hash = (algorithm, data, { encoding = 'base64', secret } = {}) => {
  let result;

  if (secret) {
    result = crypto.createHmac(algorithm, secret === true ? appConfig.secret : secret);
  } else {
    result = crypto.createHash(algorithm);
  }

  result = result
    .update(data)
    .digest(encoding);

  if (encoding === 'base64') {
    return base64.escape(result);
  }

  return result;
};

const timingSafeEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
};

exports.safeCompare = (a, b) => {
  const sa = String(a);
  const sb = String(b);
  const key = randomBytes(32);
  const ah = hash('sha256', sa, { encoding: null, secret: key });
  const bh = hash('sha256', sb, { encoding: null, secret: key });

  return timingSafeEqual(ah, bh) && a === b;
};

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

exports.jwt = {
  TokenExpiredError: jwt.TokenExpiredError,
  NotBeforeError: jwt.NotBeforeError,
  JsonWebTokenError: jwt.JsonWebTokenError,

  sign: (payload, options = {}) =>
    jwtSign(payload, appConfig.jwt.private, {
      issuer: appConfig.jwt.issuer,
      algorithm: appConfig.jwt.algorithm,
      ...options
    }),

  verify: async (token, options = {}) => {
    try {
      return await jwtVerify(token, appConfig.jwt.public, {
        issuer: appConfig.jwt.issuer,
        algorithm: appConfig.jwt.algorithm,
        ...options
      });
    } catch (err) {
      if (err instanceof SyntaxError && err.message.startsWith('Unexpected') && err.message.includes('JSON')) {
        error.httpThrow(400);
      }

      if (err.name === 'JsonWebTokenError') {
        error.httpThrow(401);
      }

      if (err.name === 'TokenExpiredError') {
        error.httpThrow(...authError.tokenHasBeenExpired);
      }

      throw err;
    }
  },

  decode: (token, options) => {
    try {
      return jwt.decode(token, options);
    } catch (err) {
      if (err instanceof SyntaxError && err.message.startsWith('Unexpected') && err.message.includes('JSON')) {
        error.httpThrow(400);
      }
      throw err;
    }
  }
};
