export default {
  REDIS_PASSWORD: String(process.env.REDIS_PASSWORD),
  REDIS_HOST: String(process.env.REDIS_HOST),
  REDIS_PORT: Number(process.env.REDIS_PORT),

  DATABASE: String(process.env.REDIS_PASSWORD),

  ROARR_LOG: Boolean(process.env.ROARR_LOG),
  ENV_TYPE: String(process.env.ENV_TYPE),
};
