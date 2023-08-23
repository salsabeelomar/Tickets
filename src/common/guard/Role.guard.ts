import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CheckExisting } from '../utils/checkExisting';
import { Roles } from '../types/Roles.types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflect: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflect.get<Roles[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return roles.some((role) => request.user?.role.includes(role));
  }
}
