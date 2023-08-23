import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const TransactionDeco = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.transaction;
  },
);
