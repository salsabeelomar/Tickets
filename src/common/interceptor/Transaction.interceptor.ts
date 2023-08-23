import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  Inject,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE } from '../constant/database.constant';
import { Transaction } from 'sequelize';
import { Observable, catchError, tap } from 'rxjs';
import { WinstonLogger } from '../logger/winston.logger';

@Injectable()
export class TransactionInter implements NestInterceptor {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(DATABASE)
    private sequelizeInstance: Sequelize,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const transaction: Transaction = await this.sequelizeInstance.transaction();
    request.transaction = transaction;

    return next.handle().pipe(
      tap(() => {
        this.logger.debug('Query Successfully Passed');
        transaction.commit();
      }),
      catchError((err) => {
        this.logger.error('Query Rollback', 'in Transaction Interceptor ');
        transaction.rollback();
        throw new BadGatewayException(err);
      }),
    );
  }
}
