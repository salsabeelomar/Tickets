import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CheckExisting } from '../utils/checkExisting';
import { UserService } from 'src/modules/user/user.service';
import { WinstonLogger } from '../logger/winston.logger';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new WinstonLogger();
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflect: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflect.get('isPublic', context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    try {
      const token = request.headers.authorization?.split('Bearer ')[1];
      const decoded = await this.jwtService.verifyAsync(token);
      const user = await this.userService.getUserById(decoded.sub);

      this.logger.log(
        ` Auth user with ID ${decoded.sub} Role ${decoded.user.role}`,
      );
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException('Token Expired Or Invalid signature');
    }

    return true;
  }
}
