import { DATABASE } from 'src/common/constant/database.constant';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/entities/user.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { TicketStatus } from '../ticket-status/entities/ticket-status.entity';
import { Tracking } from '../tracking/entities/tracking.entity';

export const databaseProvider = {
  provide: DATABASE,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const sequelize = new Sequelize({
      ...configService.get('database'),
      define: {
        paranoid: true,
        deletedAt: true,
        underscored: true,
      },
    });
    sequelize.addModels([User, Tracking, Ticket, TicketStatus]);
    await sequelize.sync();
    return sequelize;
  },
};
