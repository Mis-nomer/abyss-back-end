import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE, HTTP_STATUS } from '@common/types';
import Elysia, { ErrorHandler } from 'elysia';

const handleValidationError = (error) => {
  const messages = error.all.map(
    ({ path, value, message }) => `${message} for ${(path ?? '').substring(1)}, found ${value}`
  );

  return {
    code: HTTP_CODE.BAD_REQUEST,
    message: messages,
  };
};

const handleCustomError = (error: HTTP_ERROR) => {
  switch (error.code) {
    case 'CREATE_FAIL':
    case 'DUPLICATE':
      return {
        status: HTTP_STATUS.BAD_REQUEST,
        code: HTTP_CODE[error.code],
        message: error.message || HTTP_MESSAGE.AUTH.DUPLICATE,
      };
    case 'FORBIDDEN':
    case 'RESTRICT_NOT_VERIFIED':
      return {
        status: HTTP_STATUS.FORBIDDEN,
        code: HTTP_CODE[error.code],
        message: error.message || HTTP_MESSAGE.ROOM.RESTRICT_NOT_VERIFIED,
      };
    case 'NOT_VERIFIED':
      return {
        status: HTTP_STATUS.FORBIDDEN,
        code: HTTP_CODE[error.code],
        message: error.message || HTTP_MESSAGE.AUTH.NOT_VERIFIED,
      };
    default:
      return {
        status: HTTP_STATUS.UNKNOWN,
        code: HTTP_CODE.UNKNOWN,
        message: HTTP_MESSAGE.UNKNOWN,
      };
  }
};

const errorHandler: ErrorHandler<{ readonly HTTP_ERROR: HTTP_ERROR }> = ({
  code,
  error,
  set,
}): HTTP_RESPONSE => {
  switch (code) {
    case 'VALIDATION':
      set.status = HTTP_STATUS.BAD_REQUEST;
      return handleValidationError(error);

    case 'INTERNAL_SERVER_ERROR':
    case 'NOT_FOUND':
    case 'PARSE':
      set.status = HTTP_STATUS[code];

      return {
        code: HTTP_CODE[code],
        message: HTTP_MESSAGE[code],
      };
    case 'INVALID_COOKIE_SIGNATURE':
      set.status = HTTP_CODE.BAD_REQUEST;

      return {
        code: HTTP_CODE.INVALID_COOKIE_SIGNATURE,
        message: HTTP_MESSAGE.INVALID_COOKIE_SIGNATURE,
      };
    default:
      const { status, code: customCode, message } = handleCustomError(error as HTTP_ERROR);
      set.status = status;

      return {
        code: customCode,
        message,
      };
  }
};

export default () => new Elysia().error({ HTTP_ERROR }).decorate('errorHandler', errorHandler);
