import { createHash } from 'crypto';

export default (str: string, len: number = 16) =>
  createHash('sha256', { outputLength: len }).update(str).digest('hex');
