import { t } from 'elysia';

import { genericResponse } from '.';

export const createUserSchema = {
  body: t.Object({
    username: t.String(),
    uuid: t.String(),
  }),
  response: genericResponse,
};
