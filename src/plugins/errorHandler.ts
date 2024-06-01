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

const customErrorMessages = {
  CREATE_FAIL: HTTP_MESSAGE.CREATE_FAIL,
  DUPLICATE: HTTP_MESSAGE.AUTH.DUPLICATE,
  FORBIDDEN: HTTP_MESSAGE.FORBIDDEN,
  RESTRICT_NOT_VERIFIED: HTTP_MESSAGE.ROOM.RESTRICT_NOT_VERIFIED,
  NOT_VERIFIED: HTTP_MESSAGE.AUTH.NOT_VERIFIED,
};

const handleCustomError = (error: HTTP_ERROR): HTTP_RESPONSE => {
  const message = error.message || customErrorMessages[error.code] || HTTP_MESSAGE.UNKNOWN;
  const code = HTTP_CODE[error.code] || HTTP_CODE.UNKNOWN;

  return { code, message };
};

const errorHandler: ErrorHandler<{ readonly HTTP_ERROR: HTTP_ERROR }> = ({
  code,
  error,
  set,
}): HTTP_RESPONSE => {
  if (code in HTTP_STATUS) {
    set.status = HTTP_STATUS[code];
  } else {
    set.status = HTTP_CODE.UNKNOWN;
  }

  if (code === 'VALIDATION') {
    return handleValidationError(error);
  }

  const { code: customCode, message } = handleCustomError(error as HTTP_ERROR);

  return { code: customCode, message };
};

export default () => new Elysia().error({ HTTP_ERROR }).decorate('errorHandler', errorHandler);
