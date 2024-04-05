export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  PARSE_ERROR: 422,
  UNKNOWN: 520,
};

export const HTTP_MESSAGE = {
  CREATE_SUCCESS: 'Creation was successful',
  UPDATE_SUCCESS: 'Update was successful',
  DELETE_SUCCESS: 'Deletion was successful',

  CREATE_FAIL: 'Creation failed',
  UPDATE_FAIL: 'Update failed',
  DELETE_FAIL: 'Deletion failed',

  SUCCESS: 'Successful',
  FAILED: 'Failed',
  ERROR: 'Error',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNKNOWN: 'Unexpected error',
  INVALID_COOKIE_SIGNATURE: 'Invalid cookie signature',
  PARSE_ERROR: 'Unprocessable Content',

  /** Auth */
  AUTH: {
    INVALID_API_KEY: 'Invalid API key',
    REGISTER_SUCCESS: 'Account registration was successful',
    REGISTER_FAIL: 'Account registration failed',
    LOGIN_SUCCESS: 'Login was successful',
    FORGOT_PASSWORD_SUCCESS: 'Submitting the forgot password request was successful',
    FORGOT_PASSWORD_FAIL: 'Submitting the forgot password request failed',
    VERIFY_CODE_SUCCESS: 'Verifying the code was successful',
    VERIFY_CODE_FAIL: 'Verifying the code failed',
    VERIFIED: 'Account has been verified',
    NOT_VERIFIED: 'Account has not been verified',
    RESEND_VERIFY_CODE_SUCCESS: 'Resending the verification code was successful',
    RESEND_VERIFY_CODE_FAIL: 'Resending the verification code failed',
    LOGIN_FAIL: 'Login failed',
    LOGOUT_SUCCESS: 'Logout was successful',
    LOGOUT_FAIL: 'Logout failed',
    ALREADY_EXIST: 'Account already exists',
  },

  ROOM: {
    RESTRICT_NOT_VERIFIED: 'A non-verified user cannot create more than 3 rooms',
  },
};

export const HTTP_CODE = {
  ...HTTP_STATUS,
  /** File */
  FILE: {
    REQUIRED: 10001,
    UPLOAD_SUCCESS: 10002,
    UPLOAD_FAIL: 10003,
    ACCEPT_MEDIA: 10004,
    ACCEPT_IMAGE: 10005,
    MUST_BE_VIDEO: 10006,
  },
  /** Auth */
  AUTH: {
    INVALID_API_KEY: 10011,
    REGISTER_SUCCESS: 10012,
    REGISTER_FAIL: 10013,
    LOGIN_SUCCESS: 10014,
    FORGOT_PASSWORD_SUCCESS: 10016,
    FORGOT_PASSWORD_FAIL: 10017,
    VERIFY_CODE_SUCCESS: 10018,
    VERIFY_CODE_FAIL: 10019,
    VERIFIED: 10020,
    NOT_VERIFIED: 10021,
    RESEND_VERIFY_CODE_SUCCESS: 10022,
    RESEND_VERIFY_CODE_FAIL: 10023,
    LOGIN_FAIL: 10024,
    LOGOUT_SUCCESS: 10025,
    LOGOUT_FAIL: 10026,
    ALREADY_EXIST: 10029,
  },

  ROOM: {
    CREATE_SUCCESS: 10027,
    CREATE_FAIL: 10028,
    RESTRICT_NOT_VERIFIED: 10030,
  },
};

export interface HTTP_RESPONSE {
  message: string;
  code: number;
  data?: Record<string, any> | any[];
}
