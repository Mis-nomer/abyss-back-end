import { t } from 'elysia';
import type { InputSchema } from 'elysia';

import { genericResponse } from '.';

export const createUserSchema: InputSchema<never> = {
  body: t.Object({
    username: t.String(),
    email: t.Optional(
      t.String({
        format: 'email',
      })
    ),
  }),
  response: genericResponse,
};
