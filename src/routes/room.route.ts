import { HTTP_CODE, HTTP_MESSAGE, HTTP_RESPONSE, HTTP_STATUS } from '@common/types';
import filepath from '@libs/filepath';
import logger from '@libs/logger';
import errorHandler from '@plugins/errorHandler';
import { createRoomSchema, joinRoomSchema } from '@schemas/room.schema';
import roomService from '@services/room.service';
import { Elysia, t } from 'elysia';

import { Patterns, cron } from '@elysiajs/cron';

const PATH = filepath(import.meta.url, 'room.route.ts');

export default new Elysia()
  .use(errorHandler())
  .onError(({ errorHandler, ...ctx }) => errorHandler(ctx))
  .state({ activeRooms: new Map() })
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
  .ws('/join', {
    ...joinRoomSchema,

    message(ws, message) {
      if (typeof message === 'string') {
        logger.error(
          `[${PATH}] - Bad message format. Tried to parse "${message.substring(0, 60)}" ${message.length > 60 ? '...' : ''}`
        );
        ws.close();
      }
    },
    async open(ws) {
      const {
        store: { activeRooms },
        query: { room },
        cookie: { user_id },
      } = ws.data;

      if (activeRooms.has(room)) {
        const occupants = activeRooms.get(room);

        if (occupants.includes(user_id.value)) {
          ws.send({ code: HTTP_CODE.FORBIDDEN, message: 'Room already joined' });
          ws.close();
          return;
        }
        activeRooms.set(room, [...occupants, user_id.value]);
      } else {
        activeRooms.set(room, [user_id.value]);
      }
      ws.send({ code: HTTP_CODE.SUCCESS, message: 'Room joined' });
      console.log(activeRooms);
    },

    async close(ws) {
      const {
        store: { activeRooms },
        query: { room },
        cookie: { user_id },
      } = ws.data;

      const newOccupants = activeRooms.get(room).filter((id) => id !== user_id.value);

      if (newOccupants.length) {
        activeRooms.set(room, newOccupants);
      } else activeRooms.delete(room);

      console.log(activeRooms);
    },
  });
