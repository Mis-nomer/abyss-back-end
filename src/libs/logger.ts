import { LoggerColorEnum, LoggerTypeEnum } from '@common/enums';
import chalk from 'chalk';
import { ROARR, Roarr } from 'roarr';

const toAsiaTimeZone = (time: number) => {
  return new Date(time).toLocaleString('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const init = () => {
  return (message) => {
    const level = Object.entries(LoggerTypeEnum).find((l) => l[1] === message.context.logLevel);
    const logName = level![0];
    const localTime = toAsiaTimeZone(message.time);

    return {
      ...message,
      context: { localTime, logName, logColor: LoggerColorEnum[logName], ...message.context },
    };
  };
};

ROARR.write = (msg) => {
  const { context, message } = JSON.parse(msg);
  const withColor = chalk[context.logColor];

  console.log(withColor(`${context.localTime}, ${context?.logName}: ${message}`));
};

export default Roarr.child(init());
