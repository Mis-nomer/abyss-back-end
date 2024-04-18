import { RoomTypeEnum } from '@common/enums';
import { t } from 'elysia';
import { ObjectId } from 'mongoose';

import { genericResponse } from '.';

export const createRoomSchema = {
  body: t.Object({
    name: t.String(),
    private: t.Boolean(),
    type: t.Enum(RoomTypeEnum),
    // If set to false, room will not be deleted.
    burn: t.Boolean(),
    key: t.Optional(t.String({})),
    created_by: t.String(),

    // Delete room after N times. 0 for default.
    burn_after: t.Optional(
      t.Numeric({
        minimum: 0,
      })
    ),

    // Delete room after specified date. Supersede burn_after
    burn_at: t.Optional(t.Date()),
  }),
  response: genericResponse,
};
