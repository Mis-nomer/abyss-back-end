import { HTTP_CODE, HTTP_STATUS } from '@common/types';
import errorHandler from '@plugins/errorHandler';
import { createRoomSchema } from '@schemas/room.schema';
import roomService from '@services/room.service';
import Elysia from 'elysia';

const PATH = '/room';

export default new Elysia({ prefix: PATH })
  .use(errorHandler())
  .onError(({ errorHandler, ...ctx }) => errorHandler(ctx))
  .post(
    '',
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
  );
