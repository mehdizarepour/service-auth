const { env } = process;

// server
exports.server = {
  port: env.APP_PORT || 8080,
  hostname: env.APP_HOSTNAME,
  origin: env.APP_ORIGIN,
  cdn: env.CDN_ORIGIN
};

// environment
exports.isDev = env.NODE_ENV !== 'production';

// database
exports.db = {
  // DB configs
};

exports.memory = {};

exports.errorCodePrefix = 'APP_';
