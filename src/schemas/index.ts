import { t } from 'elysia';

export const genericResponse = t.Object({
  code: t.String({
    description: 'Response code',
  }),
  message: t.String({
    description: 'Response message',
  }),
  data: t.Optional(t.Union([t.Array(t.Any()), t.Record(t.String(), t.Any())])),
});
