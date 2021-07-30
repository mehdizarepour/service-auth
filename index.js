require('module-alias/register');

const {
  uncaughtExceptionHandler,
  unhandledRejectionHandler,
  httpErrorHandler
} = require('~/lib/error');

process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', unhandledRejectionHandler);

const onExit = require('signal-exit');
const toobusy = require('toobusy-js');

const { server: serverConfig } = require('~/config/app');
const { app } = require('./server');
let server;

if (!module.parent) {
  app.on('error', httpErrorHandler);

  server = app.listen(serverConfig.port, serverConfig.hostname, () => {
    console.log(`Listen on http://${serverConfig.hostname || '127.0.0.1'}:${serverConfig.port}`);
  });
}

onExit((code, signal) => {
  server.close();
  toobusy.shutdown();
  console.log('process exited %o', { code, signal });
});
