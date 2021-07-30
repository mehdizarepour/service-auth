const path = require('path');
const glob = require('glob');
const camelCase = require('lodash/camelCase');

const middlewares = glob.sync('*.js', { cwd: path.join(__dirname, 'middleware'), ignore: '**/*.test.js' });

module.exports = middlewares.reduce((acc, i) => {
  const name = i.replace('.js', '');

  acc[camelCase(name)] = require(`./middleware/${name}`);

  return acc;
}, {});
