import { IRoom } from '@common/interfaces';
import { HTTP_CODE, HTTP_MESSAGE, HTTP_RESPONSE, HTTP_STATUS } from '@common/types';
import RoomModel from '@models/room.model';
import crypto from 'crypto';
import type { Handler } from 'elysia';

export const createRoom: Handler = async ({ body, set }) => {
  const data = body as Partial<IRoom>;
  if (data.room_key)
    data.room_key = crypto.createHash('sha256').update(data.room_key.valueOf()).digest('hex');

  const newRoom = new RoomModel(data);
  const validateResult = newRoom.validateSync();

  let response = {
    code: HTTP_CODE.ROOM.CREATE_SUCCESS,
    message: HTTP_MESSAGE.CREATE_SUCCESS,
  } satisfies HTTP_RESPONSE;

  if (validateResult?.errors) {
    set.status = HTTP_STATUS.BAD_REQUEST;
    response.code = HTTP_CODE.ROOM.CREATE_FAIL;
    response.message = validateResult?.message;

    return response;
  }

  const saveResult = await newRoom.save();

  if (!saveResult) {
    set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    response.message = HTTP_MESSAGE.INTERNAL_SERVER_ERROR;

    return response;
  }

  set.status = HTTP_STATUS.CREATED;

  return response;
};
