import { MailerService } from '@nestjs-modules/mailer';
import { GatewayTimeoutException, Injectable } from '@nestjs/common';
import { EmailDto } from './dto/email.dto';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { activeStaff } from './dto/confirm-staff.dto';
import { STATUS } from 'src/common/types/Status.types';
import { ConfirmTic } from './dto/confirm-ticket.dto';
import { ResponseTick } from './dto/receive-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyEmailService {
  private readonly logger = new WinstonLogger();
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmUser(user: EmailDto) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@nestjs.com',
      subject: 'Verify Email from Tickets',
      text: `Hello ${user.lname} ${user.fname}`,
      html: `<b>welcome ${user.lname} ${
        user.fname
      } <a href=${this.configService.get('confirmUser')}?token=${
        user.token
      }> Confirmation  Link </a> </b>`,
    });
    this.logger.log(`Send Email for user ${user.lname} ${user.fname} `);
  }

  async invitationStaff(confirmStaff: activeStaff) {
    const activeToken = `${this.configService.get('confirmStaff')}?token=${
      confirmStaff.activeToken
    }`;
    const declineToken = `${this.configService.get('confirmStaff')}?token=${
      confirmStaff.declineToken
    }`;

    await this.mailerService.sendMail({
      to: confirmStaff.email,
      from: 'noreply@nestjs.com',
      subject: 'Add Staff from Tickets',
      text: 'Hello',
      html: `
       <h3> Confirm Your Tickets</h3>
       <div>
       <button> <a href=${activeToken}> Accept </a> </button>
       <button> <a href=${declineToken}> Decline </a> </button>
       </div>`,
    });

    this.logger.log(`Send Email for user ${confirmStaff.email} `);
  }

  async sendConfirmTicket(confirmTic: ConfirmTic) {
    await this.mailerService.sendMail({
      to: confirmTic.email,
      from: 'noreply@nestjs.com',
      subject: 'Confirm Your Tickets',
      html: `<h1>welcome ${confirmTic.username}</h1>
       <h3> Confirm Your Tickets </h3>
       <div>
       <button> <a href=${this.configService.get(
         'confirmTicket',
       )}?isConfirm=true&ticketId=${confirmTic.ticketId}> Confirm </a> </button>
       <button> <a href=${this.configService.get(
         'confirmTicket',
       )}?isConfirm=false&ticketId=${
        confirmTic.ticketId
      }> Decline </a> </button>
       </div>`,
    });
    this.logger.log(` Confirm Your Tickets ${confirmTic.username}`);
  }

  async sendUpdateTicket(status: string, user) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@nestjs.com',
      subject: `Your Ticket ${user.title} Is ${status}`,
      html: `<h1>welcome ${user.username}</h1>
       <h3> Your Tickets Status Now is ${status} Changed By The Ticket Staff ${user.username}  </h3>`,
    });
    this.logger.log(`Send Email to Ticket Is update status ${status} `);
  }
  async receiveRespTic(user: ResponseTick) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@nestjs.com',
      subject: `Your Ticket ${user.title} Has Response `,
      html: `<h1>welcome ${user.username}</h1>
       <h3> Your Tickets Has Response from  Ticket Staff  </h3>`,
    });
    this.logger.log(` Your Tickets Has Response from  Ticket Staff `);
  }
  sendLateEmails(staff) {
    this.logger.log(` You Have schedule Tickets `);
    return this.mailerService.sendMail({
      to: staff.email,
      from: 'noreply@nestjs.com',
      subject: `You Have schedule Tickets `,
      html: `<h1>welcome ${staff.username}</h1>
       <h3> You Have schedule Tickets   </h3>`,
    });
  }
}
