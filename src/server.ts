'use strict';

import connectDatabase from '@libs/database';
import filepath from '@libs/filepath';
import { logger } from '@libs/logger';
import roomRoute from '@routes/room.route';
import userRoute from '@routes/user.route';
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
  .use(roomRoute)
  .use(userRoute)
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
