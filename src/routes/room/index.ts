import { RoomTypeEnum } from '@common/enums';
import { createRoom } from '@controllers/room.controller';
import { genericErrorHandler } from '@plugins/errorHandler';
import Elysia, { t } from 'elysia';

const createRoomRequestJSON = t.Object({
  room_name: t.Optional(t.String()),
  room_private: t.Boolean(),
  room_type: t.Enum(RoomTypeEnum),
  // If set to false, room will not be deleted.
  room_burn: t.Boolean(),
  room_key: t.Optional(t.String({})),

  room_whitelist: t.Optional(t.Boolean()),
  room_created_by: t.String(),

  // Delete room after N times. 0 for default.
  burn_after: t.Optional(
    t.Numeric({
      minimum: 0,
    })
  ),

  // Delete room after specified date. Supersede burn_after
  burn_date: t.Optional(t.Date()),
});

export default new Elysia()
  .use(genericErrorHandler())
  .post('/api/v1/room', createRoom, {
    body: createRoomRequestJSON,
  })
  .onError(({ code, error, set, errorHandle }) => errorHandle(code, error, set));
