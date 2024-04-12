import { t } from 'elysia';

export const genericResponse = t.Object({
  code: t.Union([
    t.String({
      description: 'Response code',
    }),
    t.Number(),
  ]),
  message: t.Union([
    t.String({
      description: 'Response code',
    }),
    t.Array(t.String()),
  ]),
  data: t.Optional(t.Any()),
});
