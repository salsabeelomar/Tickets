import { WinstonLogger } from '../logger/winston.logger';

export const CheckExisting = (
  condition: any,
  error: any,
  message: { msg: string; trace: string },
) => {
  const logger = new WinstonLogger();
  if (!condition) {
    logger.error(message.msg, message.trace);
    throw new error(message.msg);
  }
  return true;
};