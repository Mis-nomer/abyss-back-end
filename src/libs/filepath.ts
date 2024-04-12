import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';

export default (url: string, fallbackPath: string, substr = 'src') => {
  if (process.env.NODE_ENV === 'development') {
    const path = fileURLToPath(url);
    const filePath = dirname(path);
    const srcIndex = filePath.indexOf(substr);
    return join(filePath.substring(srcIndex), basename(path));
  }
  return join(substr, fallbackPath);
};
