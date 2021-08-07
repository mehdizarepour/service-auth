exports.app = {
  problem: [
    500,
    'there is a problem',
    {
      code: 'problem'
    }
  ]
};

exports.auth = {
  unauthorized: [
    401,
    'unauthorized',
    {
      code: 'unauthorized'
    }
  ],

  invalidRefreshToken: [
    400,
    'refresh token is invalid',
    {
      code: 'invalidRefreshToken'
    }
  ],

  tokenHasBeenExpired: [
    401,
    'token has been expired',
    {
      code: 'tokenHasBeenExpired'
    }
  ]
};
