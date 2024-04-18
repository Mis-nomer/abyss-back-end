import { t } from 'elysia';

import { genericResponse } from '.';

export const createUserSchema = {
  body: t.Object({
    username: t.String(),
    fingerprint: t.String(),
  }),
  response: genericResponse,
};
