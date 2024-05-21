import { HTTP_CODE, HTTP_STATUS } from '@common/types';
import filepath from '@libs/filepath';
import logger from '@libs/logger';
import errorHandler from '@plugins/errorHandler';
import { createRoomSchema, joinRoomSchema } from '@schemas/room.schema';
import roomService from '@services/room.service';
import Elysia from 'elysia';

import { Patterns, cron } from '@elysiajs/cron';

const PATH = filepath(import.meta.url, 'room.route.ts');

export default new Elysia()
  .use(errorHandler())
  .onError(({ errorHandler, ...ctx }) => errorHandler(ctx))
  .use(
    cron({
      name: 'routine',
      pattern: Patterns.EVERY_5_MINUTES,
      async run() {
        const result = await roomService.routineDelete();

        logger.info(`[${PATH}] - Room deleted: ${result?.deletedCount}`);
      },
    })
  )
  .post(
    '/room',
    async ({ body, set }) => {
      const result = await roomService.create(body);

      switch (result.code) {
        case HTTP_CODE.INTERNAL_SERVER_ERROR:
          set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          break;
        case HTTP_CODE.RESTRICT_NOT_VERIFIED:
          set.status = HTTP_CODE.BAD_REQUEST;
        default:
          set.status = HTTP_STATUS.CREATED;
          break;
      }
      return result;
    },
    createRoomSchema
  )
  .post(
    '/join/:room_id',
    async ({ params, body, set }) => {
      const result = await roomService.join(params.room_id, body.user_id);

      switch (result.code) {
        case HTTP_CODE.INTERNAL_SERVER_ERROR:
          set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          break;
        case HTTP_CODE.RESTRICT_NOT_VERIFIED:
          set.status = HTTP_CODE.BAD_REQUEST;
        default:
          set.status = HTTP_STATUS.CREATED;
          break;
      }
      return result;
    },
    joinRoomSchema
  );
