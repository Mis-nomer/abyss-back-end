import filepath from '@libs/filepath';
import mongoose from 'mongoose';

import { logger } from './logger';

const connectionString = process.env.DATABASE;

const connect = async () => {
  try {
    if (!connectionString) throw new Error('Failed to connect to MongoDB');

    await mongoose.connect(connectionString);

    logger.info(`[${filepath.current}] - Successfully connected to database`);
  } catch (error) {
    logger.error(`[${filepath.current}] - ${error}`);
  }
};

export default connect;
