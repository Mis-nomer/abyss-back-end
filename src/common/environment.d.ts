// For Bun
declare module 'bun' {
  interface Env {
    SERVER_PORT: number;
    MONGODB_URL: string;

    REDIS_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: number;

    PREFIX_VERSION: string;

    NODE_ENV: string;
  }
}

// For Node
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: number;
      MONGODB_URL: string;

      REDIS_PASSWORD: string;
      REDIS_HOST: string;
      REDIS_PORT: number;

      PREFIX_VERSION: string;

      NODE_ENV: string;
    }
  }
}

export {};
