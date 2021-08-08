const PhoneNumber = require('awesome-phonenumber');
const Joi = require('joi');

module.exports = Joi.extend((joi) => ({
  type: 'phoneNumber',
  base: joi.string(),
  messages: {
    'phoneNumber.mobile': '{{#label}} is not a valid mobile number!'
  },
  validate (value, helpers) {
    const pn = new PhoneNumber(value);

    if (helpers.schema.$_getFlag('mobile') && !(pn.isValid() && pn.isMobile())) {
      return { value, errors: helpers.error('phoneNumber.mobile') };
    }

    return { value: pn.getNumber('e164') };
  },
  rules: {
    mobile: {
      method () {
        return this.$_setFlag('mobile', true);
      }
    }
  }
}));
