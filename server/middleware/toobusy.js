const toobusy = require('toobusy-js');

toobusy.maxLag(700);
toobusy.interval(500);

module.exports = () => (ctx, next) => {
  if (toobusy()) {
    ctx.throw(503);
  }

  return next();
};
