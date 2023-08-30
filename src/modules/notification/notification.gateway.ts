import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserService } from 'src/modules/user/user.service';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { ROOM } from 'src/common/gateways/room.gateway';

@WebSocketGateway()
export class NotificationService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new WinstonLogger();

  constructor(private jwt: JwtService, private userService: UserService) {}

  async handleConnection(client: Socket) {
    try {
      const headers = client.handshake.headers;
      const token = headers.authorization?.split('Bearer ')[1];

      const decoded = this.jwt.verify(token);

      const user = await this.userService.getUserById(decoded.sub);

      switch (user.role) {
        case ROOM.SUPPORT_STAFF:
          client.join(ROOM.SUPPORT_STAFF);
          client.join(ROOM.SUPPORT_STAFF + user.id);
          break;

        case ROOM.USER:
          client.join(ROOM.USER + user.id);
          break;

        default: {
          client.disconnect(true);
          throw new ForbiddenException();
        }
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        client.send(new BadRequestException(' Token Expired '));
        client.disconnect(true);
      } else {
        client.send(new UnauthorizedException('Invalid Token '));
        client.disconnect(true);
      }
    }
  }
  handleDisconnect(client: Socket) {
    client.disconnect();
  }
}
