import filepath from '@libs/filepath';
import errorHandler from '@plugins/errorHandler';
import { createUserSchema } from '@schemas/user.schema';
import userService from '@services/user.service';
import Elysia from 'elysia';

import { Patterns, cron } from '@elysiajs/cron';

const PATH = filepath(import.meta.url, 'server.ts');
const ROUTE = '/user';

export default new Elysia({ prefix: ROUTE })
  .use(errorHandler())
  .onError(({ errorHandler, ...ctx }) => errorHandler(ctx))
  .use(
    cron({
      name: 'routine',
      pattern: Patterns.EVERY_DAY_AT_1AM,
      run() {
        const result = userService.routineDelete();
      },
    })
  )
  .post(
    '/',
    async ({ body }) => {
      const result = await userService.create(body);

      return result;
    },
    createUserSchema
  );
