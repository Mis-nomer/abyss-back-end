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
  cookie: t.Cookie({
    user_id: t.String(),
  }),
  query: t.Object({
    room: t.String(),
  }),
  message: t.Union([
    t.Object({
      type: t.Enum(roomActionEnum),
      content: t.String(),
    }),
    t.String(),
  ]),
  response: genericResponse,
};
