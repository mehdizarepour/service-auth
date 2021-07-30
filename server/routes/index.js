
const path = require('path');
const glob = require('glob');
const Router = require('koa-router');
const compose = require('koa-compose');

// internal api router
const internalApiRouter = exports.internalApi = new Router({
  prefix: '/internal-api'
});

// api router
const apiRouter = exports.api = new Router({
  prefix: '/api'
});

// load routers
glob.sync(path.join('internal-api', '*.js'), { cwd: __dirname, ignore: '**/*.test.js' }).forEach(i => require(`./${i}`)(internalApiRouter));
glob.sync(path.join('api', '*.js'), { cwd: __dirname, ignore: '**/*.test.js' }).forEach(i => require(`./${i}`)(apiRouter));

// export route middleware
exports.middleware = () => compose([
  internalApiRouter.routes(),
  internalApiRouter.allowedMethods(),

  apiRouter.routes(),
  apiRouter.allowedMethods()
]);
