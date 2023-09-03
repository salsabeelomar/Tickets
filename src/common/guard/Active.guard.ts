import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CheckExisting } from '../utils/checkExisting';

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(private readonly reflect: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const isActive = this.reflect.get('isActive', context.getHandler());

    if (isActive !== undefined) return true;

    const request = context.switchToHttp().getRequest();

    if (!request.user?.isActive)
      throw new ForbiddenException({
        msg: 'Please Activate Your Account',
        trace: 'ActiveGuard',
      });

    return true;
  }
}
