const fs = require('fs');

const { env } = process;

// server
exports.server = {
  port: env.APP_PORT || 8080,
  hostname: env.APP_HOSTNAME,
  origin: env.APP_ORIGIN,
  cdn: env.CDN_ORIGIN
};

exports.jwt = {
  tokenMaxAge: '30d',
  refreshTokenMaxAge: '1y',
  algorithm: 'RS256',
  issuer: 'init:auth',
  private: fs.readFileSync(env.APP_JWT_SECRET_PRIVATE || './runtime/private.key'),
  public: fs.readFileSync(env.APP_JWT_SECRET_PUBLIC || './runtime/public.crt')
};

// environment
exports.isDev = env.NODE_ENV !== 'production';

// database
exports.db = {
  // DB configs
};

exports.redis = {
  host: env.REDIS_HOST,
  port: 6379,
  // password: fs.readFileSync(env.REDIS_PASSWORD_FILE, 'utf8'),
  db: env.REDIS_DB
};

exports.errorCodePrefix = 'AUTH_';
