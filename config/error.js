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
  invalidVerificationToken: [
    422,
    'invalid verification token',
    {
      code: 'invalidVerificationToken',
    }
  ],

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
  ],

  invalidVerificationCode: [
    400,
    'invalid verification code',
    {
      code: 'invalidVerificationCode'
    }
  ]
};

exports.user = {
  userIsNotActive: [
    422,
    'user is not active',
    {
      code: 'userIsNotActive'
    }
  ],

  registerNotComplete: [
    422,
    'register is not completed',
    {
      code: 'registerNotComplete'
    }
  ]
};
