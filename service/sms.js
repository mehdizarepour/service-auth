const debug = require('debug')('app:service:notification');

const { castArray } = require('lodash');
const { memory: db } = require('~/config/app');
const { auth: authError } = require('~/config/error');
const { httpInvariant } = require('~/lib/error');

/**
 * Send verification code
 * @param {String} phoneNumber
 * @param {String} code
 */
exports.sendVerificationCode = (phoneNumber, code) => {
  const smsList = castArray(db.sms);

  // TODO: expireAt
  smsList.push({ phoneNumber, code });
  db.sms = smsList;

  debug(`phone number: ${phoneNumber}, code: ${code}`);
};

/**
 * Verify phone number
 * @param {String} phoneNumber
 * @param {String} code
 * @returns {Boolean}
 */
exports.verifyPhoneNumber = (phoneNumber, code) => {
  const verification = castArray(db.sms).find(i =>
    i.phoneNumber === phoneNumber && i.code === code
  );

  httpInvariant(verification, ...authError.invalidVerificationCode);

  return true;
};
