import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { TICKET_EVENTS } from 'src/common/events/ticket.events';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ROOM } from 'src/common/gateways/room.gateway';

@Injectable()
export class TicketEmitterService {
  @WebSocketServer()
  server: Server;

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
