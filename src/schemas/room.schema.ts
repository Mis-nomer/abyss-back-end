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
  params: t.Object({
    room_id: t.String(),
  }),
  body: t.Object({
    user_id: t.String(),
  }),
  response: genericResponse,
};
