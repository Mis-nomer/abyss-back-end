import { IRoom } from '@common/interfaces';
import { HTTP_CODE, HTTP_STATUS } from '@common/types';
import { genericErrorHandler } from '@plugins/errorHandler';
import { createRoomSchema } from '@schemas/room.schema';
import roomService from '@services/room.service';
import Elysia from 'elysia';

const PATH = '/room';

export default new Elysia({ prefix: PATH })
  .use(genericErrorHandler())
  .post(
    '',
    async ({ body, set }) => {
      const result = await roomService.create(body as Partial<IRoom>);

      switch (result.code) {
        case HTTP_CODE.INTERNAL_SERVER_ERROR:
          set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          break;
        case HTTP_CODE.ROOM.RESTRICT_NOT_VERIFIED:
        case HTTP_CODE.ROOM.CREATE_FAIL:
          set.status = HTTP_CODE.BAD_REQUEST;
        default:
          set.status = HTTP_STATUS.CREATED;
          break;
      }
      return result;
    },
    createRoomSchema
  )
  .onError(({ code, error, set, errorHandle }) => errorHandle(code, error, set));
