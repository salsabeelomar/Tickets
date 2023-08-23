import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserService } from 'src/modules/user/user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { ROOM } from 'src/common/gateways/room.gateway';
import { TICKET_EVENTS } from 'src/common/events/ticket.events';

@WebSocketGateway()
export class NotificationService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new WinstonLogger();
  constructor(
    private jwt: JwtService,
    private userService: UserService, // @Inject() private addressService: AddressService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const headers = client.handshake.headers;
      const token = headers.authorization?.split('Bearer ')[1];

      const decoded = this.jwt.verify(token);

      const user = await this.userService.getUserById(decoded.sub);

      CheckExisting(user, UnauthorizedException, {
        msg: 'You Must Login',
        trace: 'NotificationService.handleConnection',
      });

      console.log(user.role);
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
  handleDisconnect() {}

  @OnEvent(TICKET_EVENTS.CREATE)
  notifyCreateTic(@MessageBody() payload) {
    this.server
      .to(ROOM.SUPPORT_STAFF)
      .timeout(5000)
      .emitWithAck(TICKET_EVENTS.CREATE, payload);
  }

  @OnEvent(TICKET_EVENTS.UPDATE_STATUS)
  UpdateStatus(@MessageBody() payload) {
    return this.server
      .to(ROOM.USER + payload.notifiedId)
      .timeout(5000)
      .emitWithAck(TICKET_EVENTS.UPDATE_STATUS, payload);
  }

  @OnEvent(TICKET_EVENTS.ASSIGNMENT)
  notifyAssignTic(@MessageBody() payload) {
    return this.server
      .to(ROOM.SUPPORT_STAFF + payload.notifiedId)
      .emit(TICKET_EVENTS.ASSIGNMENT, payload);
  }

  @OnEvent(TICKET_EVENTS.ADD_RESPONSE)
  notifyCommentTic(@MessageBody() payload) {
    return this.server
      .to(ROOM.USER + payload.notifiedId)
      .emit(TICKET_EVENTS.ADD_RESPONSE, payload);
  }

  @OnEvent(TICKET_EVENTS.UPDATE)
  notifyUpdatedTic(@MessageBody() payload) {
    return this.server
      .to(ROOM.SUPPORT_STAFF + payload.staff.id)
      .emit(TICKET_EVENTS.UPDATE, payload);
  }
}
