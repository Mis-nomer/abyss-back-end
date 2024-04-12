import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';

export default (url: string, substr = 'src') => {
  const path = fileURLToPath(url);
  const filePath = dirname(path);
  const srcIndex = filePath.indexOf(substr);
  if (process.env.NODE_ENV === 'development') {
    return join(filePath.substring(srcIndex), basename(path));
  }
  return url;
};
