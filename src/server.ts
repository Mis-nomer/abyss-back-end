'use strict';

import connectMongoDB from '@libs/database';
import filepath from '@libs/filepath';
import logger from '@libs/logger';
import { Elysia, t } from 'elysia';

import cors from '@elysiajs/cors';

const PATH = filepath(import.meta.url, 'server.ts');

const app = new Elysia({ prefix: '/api/' + Bun.env.PREFIX_VERSION })
  .use(
    cors({
      origin: true,
    })
  )
  .use(import('@routes/room.route'))
  .use(import('@routes/user.route'))
  .listen(Bun.env.SERVER_PORT ?? 3000);

connectMongoDB();

logger.info(`[${PATH}] - Server running on ${Bun.env.NODE_ENV}`);

logger.info(
  `[${PATH}] - 🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export { app };
export type ElysiaApp = typeof app;
