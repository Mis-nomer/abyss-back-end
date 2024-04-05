import { RoomTypeEnum } from '@common/enums';
import { t } from 'elysia';
import type { InputSchema } from 'elysia';

import { genericResponse } from '.';

export const createRoomSchema: InputSchema<never> = {
  body: t.Object({
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
  }),
  response: genericResponse,
};
