import { DATABASE } from 'src/common/constant/database.constant';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/models/user.model';
import { Ticket } from '../ticket/models/ticket.model';
import { TicketStatus } from '../ticket-status/models/ticket-status.model';
import { Tracking } from '../tracking/models/tracking.model';
import { Feedback } from '../feedbacks/models/feedback.model';
import { Category } from '../category/models/category.model';
import { Tags } from '../tags/models/tag.model';
import { SupportStaff } from '../support-staff/models/support-staff.model';
import { AssignmentTickets } from '../assignment-ticket/models/assignment.model';

export const databaseProvider = [
  {
    provide: DATABASE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        ...configService.get('database'),
        define: {
          underscored: true,
        },
      });
      sequelize.addModels([
        User,
        Tracking,
        Ticket,
        TicketStatus,
        AssignmentTickets,
        Tags,
        Feedback,
        Category,
        SupportStaff,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
