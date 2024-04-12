import mongoose from 'mongoose';

import logger from './logger';

const connect = async () => {
  try {
    if (!process.env.MONGODB_URL) throw new Error('Failed to connect to MongoDB');

    await mongoose.connect(process.env.MONGODB_URL);

    logger.info('Successfully connected to database');
  } catch (error) {
    logger.error((error as Error).message);
  }
};

export default connect;
