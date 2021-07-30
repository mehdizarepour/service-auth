const crypto = require('crypto');
const base64Url = require('base64-url');

const appConfig = require('~/config/app');

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
