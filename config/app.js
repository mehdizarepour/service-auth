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
  tokenMaxAge: env.APP_JWT_TOKEN_MAX_AGE,
  refreshTokenMaxAge: env.APP_JWT_REFRESH_TOKEN_MAX_AGE,
  algorithm: 'RS256',
  issuer: 'init:auth',
  private: env.APP_JWT_SECRET_PRIVATE || fs.readFileSync(env.APP_JWT_SECRET_PRIVATE_FILE),
  public: env.APP_JWT_SECRET_PUBLIC || fs.readFileSync(env.APP_JWT_SECRET_PUBLIC_FILE)
};

// environment
exports.isDev = env.NODE_ENV !== 'production';

// database
exports.db = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_DATABASE,
  username: env.DB_USERNAME || fs.readFileSync(env.DB_USERNAME_FILE, 'utf-8'),
  password: env.DB_PASSWORD || fs.readFileSync(env.DB_PASSWORD_FILE, 'utf-8')
};

exports.memory = {
  sms: []
};

exports.redis = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || fs.readFileSync(env.REDIS_PASSWORD_FILE, 'utf8'),
  db: env.REDIS_DB
};

exports.errorCodePrefix = 'AUTH_';
