import { IUser } from '@common/interfaces';
import { HTTP_STATUS } from '@common/types';
import { client } from '@libs/redis';
import errorHandler from '@plugins/errorHandler';
import { createUserSchema } from '@schemas/user.schema';
import userService from '@services/user.service';
import Elysia from 'elysia';

import { Patterns, cron } from '@elysiajs/cron';

const PATH = '/user';

export default new Elysia({ prefix: PATH })
  .use(errorHandler())
  .onError(({ errorHandler, ...ctx }) => errorHandler(ctx))
  .use(
    cron({
      name: 'routine',
      pattern: Patterns.EVERY_DAY_AT_1AM,
      run() {
        userService.routineDelete();
      },
    })
  )
  .post(
    '',
    async ({ body, set }) => {
      // const result = await userService.create(body as Partial<IUser>);
      const data = body as Partial<IUser>;
      const isExist = await userService.findOne('', { username: data.username });

      if (!isExist) {
        client.SETEX('ss', 86400, JSON.stringify(data));
      }

      set.status = HTTP_STATUS.CREATED;

      return data;
    },
    createUserSchema
  );
