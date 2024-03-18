('use strict');
import winston from 'winston';
const colorizer = winston.format.colorize();

const logLevel = 'debug';

const toAsiaTimeZone = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
};

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: toAsiaTimeZone,
    }),
    winston.format.simple(),
    winston.format.printf((msg) =>
      colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)
    )
  ),
  transports: [new winston.transports.Console()],
});
