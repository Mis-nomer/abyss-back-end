import { HTTP_MESSAGE, HTTP_STATUS } from '@common/types';
import Elysia from 'elysia';

//? Remember to type-safe this
export const genericErrorHandler = () =>
  new Elysia().decorate('errorHandle', (code, error, set) => {
    const statusCodes = {
      VALIDATION: HTTP_STATUS.BAD_REQUEST,
      NOT_FOUND: HTTP_STATUS.NOT_FOUND,
      PARSE: HTTP_STATUS.PARSE_ERROR,
      INTERNAL_SERVER_ERROR: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      INVALID_COOKIE_SIGNATURE: HTTP_STATUS.BAD_REQUEST,
      default: HTTP_STATUS.UNKNOWN,
    };

    const messages = {
      VALIDATION: `${HTTP_MESSAGE.BAD_REQUEST}: ${error.validator.Errors(error.value).First().message} for ${error.validator.Errors(error.value).First().path} (got ${error.validator.Errors(error.value).First().value})`,
      NOT_FOUND: HTTP_MESSAGE.NOT_FOUND,
      PARSE: HTTP_MESSAGE.PARSE_ERROR,
      INTERNAL_SERVER_ERROR: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      INVALID_COOKIE_SIGNATURE: HTTP_MESSAGE.INVALID_COOKIE_SIGNATURE,
      default: HTTP_MESSAGE.UNKNOWN,
    };

    const status = statusCodes[code] || statusCodes['default'];
    const message = messages[code] || messages['default'];

    set.status = status;

    return {
      code: status,
      message,
    };
  });
