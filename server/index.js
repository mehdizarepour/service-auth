const Koa = require('koa');
const body = require('koa-body');

const appConfig = require('~/config/app');
const mw = require('./middleware');
const routes = require('./routes');

const app = exports.app = new Koa();

app.proxy = true;

(async () => {
  app
    .use(mw.toobusy())
    .use(mw.errorHandler({
      formatErrorCode: code => appConfig.errorCodePrefix + code
    }))
    .use(body({
      jsonLimit: '4kb',
      formLimit: '4kb',
      text: false,
      onError: (error, ctx) => {
        if (error.name === 'PayloadTooLargeError') {
          ctx.throw(413);
        }
      }
    }))
    .use(routes.middleware());
})();
