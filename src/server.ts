'use strict';

import connectDatabase from '@libs/database';
import filepath from '@libs/filepath';
import logger from '@libs/logger';
import { Elysia, t } from 'elysia';

import cors from '@elysiajs/cors';

console.log(process.env.NODE_ENV, typeof process.env.ROARR_LOG);

const app = new Elysia({ prefix: '/api' + process.env.PREFIX_VERSION })
  .use(
    cors({
      origin: true,
    })
  )
  .use(import('@routes/room.route'))
  .use(import('@routes/user.route'))
  .ws('/chat', {
    body: t.String(),
    response: t.String(),
    message(ws, message) {
      ws.send(message);
    },
    open(ws) {
      logger.info(`[${filepath(import.meta.url)}] - ${ws.data}`);
    },
  })
  .listen(process.env.SERVER_PORT ?? 3000);

connectDatabase();

logger.info(
  `[${filepath(import.meta.url)}] - 🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export { app };
export type ElysiaApp = typeof app;
