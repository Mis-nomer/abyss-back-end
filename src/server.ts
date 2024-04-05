'use strict';

import connectDatabase from '@libs/database';
import filepath from '@libs/filepath';
import { logger } from '@libs/logger';
import { Elysia, t } from 'elysia';

import cors from '@elysiajs/cors';

const PREFIX_ROUTE = process.env.PREFIX_ROUTE ?? '/api';
const PREFIX_VER = process.env.PREFIX_VERSION ?? '/v1';
const PORT = process.env.PORT ?? 3000;

const app = new Elysia({ prefix: PREFIX_ROUTE + PREFIX_VER })
  .use(
    cors({
      origin: true,
    })
  )
  .use(import('@routes/room.route'))
  .use(import('@routes/user.route'))
  // Default entry
  .get('/', () => ({ status: 'ok' }), {
    response: t.Object({
      status: t.String({
        description: 'Default entry. Returns ok for health check',
      }),
    }),
    detail: {
      description: 'The root endpoint',
      tags: ['App'],
    },
  })
  .ws('/chat', {
    body: t.String(),
    response: t.String(),
    message(ws, message) {
      ws.send(message);
    },
    open(ws) {
      logger.info(`[${filepath.current}] - ${ws.data}`);
    },
  })
  .listen(PORT);

connectDatabase();

logger.info(
  `[${filepath.current}] - 🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export { app };
export type ElysiaApp = typeof app;
