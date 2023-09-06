import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { Op } from 'sequelize';
import { Tracking } from '../tracking/models/tracking.model';
import { PROVIDER } from 'src/common/constant/providers.constant';
import { AssignmentTickets } from '../assignment-ticket/models/assignment.model';
import { TicketStatus } from '../ticket-status/models/ticket-status.model';
import { User } from '../user/models/user.model';
import { Ticket } from '../ticket/models/ticket.model';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { SupportStaff } from '../support-staff/models/support-staff.model';

@Injectable()
export class CronJobsService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(PROVIDER.TRACKING)
    private readonly assignmentRepo: typeof AssignmentTickets,
    @Inject(PROVIDER.TICKET)
    private readonly ticketRepo: typeof Ticket,
    private readonly verifyEmailService: VerifyEmailService,
  ) {}

  @Cron('0 0 * * * *')
  async getLateSchedule() {
    try {
      this.logger.log(`Cron job for Late Schedule start At : ${new Date()}`);
      const lateSch = await this.ticketRepo.scope('basic').findAll({
        include: [
          {
            model: SupportStaff,
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['email', 'username'],
              },
            ],
          },
          {
            model: TicketStatus,
            attributes: ['status'],
            where: {
              status: 'Scheduled',
            },
          },
          {
            model: Tracking,
            where: {
              scheduledFor: {
                [Op.lt]: new Date(),
              },
            },
          },
        ],
      });
      this.logger.log(`Cron job for Late Schedule finished At : ${new Date()}`);
      lateSch.map((ele) => {
        this.verifyEmailService.sendLateEmails({
          email: ele.assigned.user.email,
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  @Cron('0 0 */2 * *')
  async getLateAssign() {
    try {
      this.logger.log(`Cron job for Late Assigned start At : ${new Date()}`);
      const twoDaysAgo = new Date();
      const latAssign = await this.assignmentRepo.findAll({
        attributes: ['id'],
        include: [
          {
            model: Tracking,
            attributes: ['id'],
            where: {
              createdAt: {
                [Op.gt]: twoDaysAgo,
              },
            },
          },
        ],
      });
      latAssign.map((ele) => {
        this.verifyEmailService.sendLateEmails({
          email: ele.user.email,
        });
      });
      this.logger.log(`Cron job for Late Assigned finished At : ${new Date()}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
