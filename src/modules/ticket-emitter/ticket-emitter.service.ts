import { Injectable } from '@nestjs/common';
import { TICKET_EVENTS } from 'src/common/events/ticket.events';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageBody } from '@nestjs/websockets';
import { ROOM } from 'src/common/gateways/room.gateway';
import { NotificationService } from '../notification/notification.gateway';

@Injectable()
export class TicketEmitterService {
  constructor(private readonly notification: NotificationService) {}

  @OnEvent(TICKET_EVENTS.CREATE)
  notifyCreateTic(@MessageBody() payload) {
    this.notification.server
      .to(ROOM.SUPPORT_STAFF)
      .timeout(5000)
      .emitWithAck(TICKET_EVENTS.CREATE, payload);
  }
  @OnEvent(TICKET_EVENTS.UPDATE_STATUS)
  UpdateStatus(@MessageBody() payload) {
    return this.notification.server
      .to(ROOM.USER + payload.notifiedId)
      .timeout(5000)
      .emitWithAck(TICKET_EVENTS.UPDATE_STATUS, payload);
  }

  @OnEvent(TICKET_EVENTS.ASSIGNMENT)
  notifyAssignTic(@MessageBody() payload) {
    return this.notification.server
      .to(ROOM.SUPPORT_STAFF + payload.notifiedId)
      .emit(TICKET_EVENTS.ASSIGNMENT, payload);
  }

  @OnEvent(TICKET_EVENTS.ADD_RESPONSE)
  notifyCommentTic(@MessageBody() payload) {
    return this.notification.server
      .to(ROOM.USER + payload.notifiedId)
      .emit(TICKET_EVENTS.ADD_RESPONSE, payload);
  }

  @OnEvent(TICKET_EVENTS.UPDATE)
  notifyUpdatedTic(@MessageBody() payload) {
    return this.notification.server
      .to(ROOM.SUPPORT_STAFF + payload.staff.id)
      .emit(TICKET_EVENTS.UPDATE, payload);
  }
}
