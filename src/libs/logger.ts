import { LoggerColorEnum, LoggerTypeEnum } from '@common/enums';
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

  if (process.env.ENV_TYPE === 'PROD') {
  } else {
    import('colorette').then((module) => {
      const withColor = module[context.logColor];
      console.log(withColor(`${context.localTime}, ${context?.logName}: ${message}`));
    });
  }
};

export const logger = Roarr.child(init());
