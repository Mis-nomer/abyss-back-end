import redis from 'redis';
import { isNonNullish, isNullish } from 'remeda';

export const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

export const cache = async (key: string, getData?: () => any): Promise<any | null> => {
  return client.GET(key).then(async (data: any) => {
    if (isNullish(data) && isNonNullish(getData)) {
      const newData = await getData();

      client.SET(key, JSON.stringify(newData), { EX: 24 * 60 * 60 });
      return await getData();
    }
    return JSON.parse(data);
  });
};
