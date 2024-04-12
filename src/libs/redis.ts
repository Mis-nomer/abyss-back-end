import redis from 'redis';

import filepath from './filepath';
import logger from './logger';

const PATH = filepath(import.meta.url, 'libs/redis.ts');

export const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on('error', (err) => {
  logger.error(`[${PATH}] - ${(err as Error).message}`);
  client.quit();
});

process.on('SIGINT', () => {
  client.quit();
  process.exit(0);
});

process.on('SIGTERM', () => {
  client.quit();
  process.exit(0);
});
