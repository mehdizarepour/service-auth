const castArray = require('lodash/castArray');

exports.clearEmptyProps = obj =>
  Object.keys(obj).reduce((acc, i) => {
    if (obj[i] !== undefined) {
      acc[i] = obj[i];
    }

    return acc;
  }, {});

exports.castArrayIfNotEmpty = (input) => {
  if (input) {
    return castArray(input);
  }

  return input;
};
