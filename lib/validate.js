const Joi = require('joi');

const regex = exports.regex = {
  base64UrlSafe: /^[a-zA-Z0-9_-]{2,}$/
};

exports.Joi = Joi.extend({
  base: Joi.string(),
  name: 'string',
  language: {
    base64UrlSafe: 'must be a valid base64 url safe string'
  },
  rules: [
    {
      name: 'base64UrlSafe',
      validate (params, value, state, options) {
        if (!regex.base64UrlSafe.test(value)) {
          return this.createError('string.base64UrlSafe', { v: value }, state, options);
        }

        return value;
      }
    }
  ]
});
