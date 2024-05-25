import { roomActionEnum } from '@common/enums';
import { t } from 'elysia';

import { genericResponse } from '.';

export const createRoomSchema = {
  body: t.Object({
    name: t.String(),
    private: t.Boolean(),
    key: t.Optional(t.String({})),
    created_by: t.String(),
  }),
  response: genericResponse,
};

export const joinRoomSchema = {
  activeRooms: t.Array(t.Record(t.String(), t.Unknown())),
  cookie: t.Cookie({
    user_id: t.String(),
  }),
  query: t.Object({
    id: t.String(),
  }),

  response: genericResponse,
};
