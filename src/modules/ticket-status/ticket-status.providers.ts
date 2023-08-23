import { Providers } from 'src/common/constant/providers.constant';
import { TicketStatus } from './entities/ticket-status.entity';

export const TicketStatusProvider = {
  provide: Providers.STATUS,
  useValue: TicketStatus,
};
