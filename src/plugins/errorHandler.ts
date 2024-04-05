import { HTTP_CODE, HTTP_MESSAGE, HTTP_STATUS } from '@common/types';
import filepath from '@libs/filepath';
import { logger } from '@libs/logger';
import Elysia from 'elysia';
import R from 'remeda';

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
      VALIDATION: HTTP_MESSAGE.BAD_REQUEST,
      NOT_FOUND: HTTP_MESSAGE.NOT_FOUND,
      PARSE: HTTP_MESSAGE.PARSE_ERROR,
      INTERNAL_SERVER_ERROR: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      INVALID_COOKIE_SIGNATURE: HTTP_MESSAGE.INVALID_COOKIE_SIGNATURE,
      default: HTTP_MESSAGE.UNKNOWN,
    };

    let statusCode = statusCodes[code] || statusCodes['default'];
    let message = messages[code] || messages['default'];

    if (code >= 11000) {
      statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      message = error.message ?? HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
    }

    set.status = statusCode;

    logger.error(`[${filepath.current}] - ${message}`);

    return {
      code: statusCode,
      message,
    };
  });
