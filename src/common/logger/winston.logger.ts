import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class WinstonLogger implements LoggerService {
  private readonly logger: any;
  constructor() {
    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.colorize(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      }),
    );

    this.logger = createLogger({
      transports: [new transports.Console()],
      format: logFormat,
    });
  }
  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
