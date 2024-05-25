import { HTTP_CODE, HTTP_ERROR, HTTP_MESSAGE, HTTP_RESPONSE, HTTP_STATUS } from '@common/types';
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
  .ws('/room', {
    ...joinRoomSchema,

    message(ws, message) {
      const {
        query: { id },
      } = ws.data;

      if (typeof message === 'string') {
        logger.error(
          `[${PATH}] - Bad message format. Tried to parse "${message.substring(0, 60)}" ${message.length > 60 ? '...' : ''}`
        );
        ws.close();
        return;
      }

      ws.publish(id, {
        code: HTTP_CODE.SUCCESS,
        message: (message as Record<string, unknown>).content as string,
      });
    },
    async open(ws) {
      const {
        store: { activeRooms },
        query: { id },
        cookie: { user_id },
      } = ws.data;

      const occupants = activeRooms.get(id);

      try {
        const currentRoom = await roomService.get(id);

        if (occupants.length > currentRoom.data.max_users) {
          throw new HTTP_ERROR('FORBIDDEN', 'Room has reached maximum allowed user');
        }
      } catch (error) {
        const errorResponse = error as HTTP_RESPONSE;

        ws.send(new HTTP_RESPONSE(errorResponse?.code, errorResponse?.message));
        ws.close();
      }

      if (!occupants) {
        activeRooms.set(id, [user_id.value]);
        ws.subscribe(id);
      } else if (occupants.includes(user_id.value)) {
        ws.send({ code: HTTP_CODE.FORBIDDEN, message: 'Room already joined' });
        ws.close();
        return;
      } else {
        activeRooms.set(id, [...occupants, user_id.value]);
        ws.subscribe(id);
      }
    },

    async close(ws) {
      const {
        store: { activeRooms },
        query: { id },
        cookie: { user_id },
      } = ws.data;

      try {
        await roomService.get(id);
      } catch (error) {
        ws.send({ code: HTTP_CODE.NOT_FOUND, message: 'Room not found' });
        return;
      }

      const occupants = activeRooms.get(id).filter((room_id) => room_id !== user_id.value);

      if (!occupants) {
        logger.error(`[${PATH}] - Tried to access unknown room`);
        return;
      }

      if (occupants.length) {
        activeRooms.set(id, occupants);
      } else activeRooms.delete(id);

      ws.unsubscribe(id);
    },
  });
