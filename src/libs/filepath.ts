// Get the current file location when being called
class PathGetter {
  get current() {
    const substr = 'src';
    const err = new Error();
    const stack = err.stack!.split('\n');
    const stackLine = stack[2]; // Line 2 usually has the caller function
    const filePath = stackLine.substring(stackLine.indexOf('(') + 1, stackLine.indexOf(')'));
    const srcIndex = filePath.indexOf(substr);

    return srcIndex !== -1 ? filePath.substring(srcIndex + substr.length) : '';
  }
}

export default new PathGetter();
