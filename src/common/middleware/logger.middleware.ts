
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonLogger } from '../logger/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new WinstonLogger();

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;
      if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      }
    });

    next();
  }
}
