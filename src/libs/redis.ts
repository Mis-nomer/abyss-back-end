import env from '@common/env';
import redis from 'redis';

export default redis.createClient({
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
});
