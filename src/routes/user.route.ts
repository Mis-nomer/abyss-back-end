import { IUser } from '@common/interfaces';
import { HTTP_CODE, HTTP_STATUS } from '@common/types';
import { genericErrorHandler } from '@plugins/errorHandler';
import { createUserSchema } from '@schemas/user.schema';
import userService from '@services/user.service';
import Elysia from 'elysia';

import { Patterns, cron } from '@elysiajs/cron';

const PATH = '/user';

export default new Elysia({ prefix: PATH })
  .use(genericErrorHandler())
  .use(
    cron({
      name: 'routine',
      pattern: Patterns.EVERY_6_HOURS,
      run() {
        userService.routineDelete();
      },
    })
  )
  .post(
    '',
    async ({ body, set }) => {
      const result = await userService.create(body as Partial<IUser>);

      switch (result.code) {
        case HTTP_CODE.INTERNAL_SERVER_ERROR:
          set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          break;
        case HTTP_CODE.AUTH.REGISTER_FAIL:
        case HTTP_CODE.AUTH.ALREADY_EXIST:
          set.status = HTTP_CODE.BAD_REQUEST;
        default:
          set.status = HTTP_STATUS.CREATED;
          break;
      }
      return result;
    },
    createUserSchema
  )
  .onError(({ code, error, set, errorHandle }) => errorHandle(code, error, set));
