import mongoose from 'mongoose';

import filepath from './filepath';
import logger from './logger';

const PATH = filepath(import.meta.url, 'libs/database.ts');

const connectMongoDB = async () => {
  try {
    if (!Bun.env.MONGODB_URL) throw new Error('No MongoDB URL found');

    await mongoose.connect(Bun.env.MONGODB_URL);

    logger.info(`[${PATH}] - Successfully connected to MongoDB`);
  } catch (error) {
    logger.error(`[${PATH}] - ${(error as Error).message}`);
  }
};

export default connectMongoDB;
