import { WinstonLogger } from '../logger/winston.logger';
import { BadRequestException } from '@nestjs/common';

export const CheckExisting = (
  condition: any,
  message: { msg: string; trace: string },
) => {
  const logger = new WinstonLogger();
  if (!condition) {
    logger.error(message.msg, message.trace);
    throw new BadRequestException(message.msg);
  }
  return true;
};
