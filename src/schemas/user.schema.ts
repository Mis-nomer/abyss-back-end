import { t } from 'elysia';
import type { InputSchema } from 'elysia';

import { genericResponse } from '.';

export const createUserSchema: InputSchema<never> = {
  body: t.Object({
    username: t.String(),
    uuid: t.String(),
  }),
  response: genericResponse,
};
