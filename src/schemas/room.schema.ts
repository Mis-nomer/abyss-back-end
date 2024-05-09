import { RoomTypeEnum } from '@common/enums';
import { t } from 'elysia';
import { ObjectId } from 'mongoose';

import { genericResponse } from '.';

export const createRoomSchema = {
  body: t.Object({
    name: t.String(),
    private: t.Boolean(),
    type: t.Enum(RoomTypeEnum),
    key: t.Optional(t.String({})),
    created_by: t.String(),
  }),
  response: genericResponse,
};
