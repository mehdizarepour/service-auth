const constantCase = require('constant-case');
const identity = require('lodash/identity');

const error = require('~/lib/error');
const obj = require('~/lib/obj');
const crypto = require('~/lib/crypto');

module.exports = ({ formatErrorCode = identity }) => async (ctx, next) => {
  ctx.httpThrow = error.httpThrow;
  ctx.invariant = error.httpInvariant;

  ctx.formatErrorCode = code => formatErrorCode(constantCase(code));

  ctx.bodyError = (status, message, props) => {
    if (!message && !props && typeof status === 'object') {
      props = status;
      status = props.status || props.statusCode;
      props.status = status;
      message = props.message;
    } else {
      props = {
        status,
        message,
        ...props
      };
    }

    if (!props.code) {
      props.code = `HTTP_${props.status || props.statusCode}`;
    }

    props.code = ctx.formatErrorCode(props.code);

    ctx.status = status;
    ctx.body = {
      errors: [props]
    };
  };

  ctx.bodyOk = (data, props) => {
    ctx.body = {
      data,
      ...props
    };
  };

  try {
    await next();
  } catch (err) {
    // validation error
    if (err.isJoi) {
      ctx.bodyError(400, err.details[0].message, obj.clearEmptyProps({
        code: 'INVALID_VALUE',
        field: err.details[0].path.join('.')
      }));

    // http error
    } else if (err instanceof error.HttpError) {
      ctx.bodyError(err);

    // server error
    } else {
      const id = crypto.base64.encode(crypto.randomBytes(32));

      err.id = id;
      error.httpErrorHandler(err);
      ctx.bodyError(error.createHttpError(500, { id }));
    }
  }
};
