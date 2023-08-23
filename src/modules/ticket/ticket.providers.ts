import { Providers } from 'src/common/constant/providers.constant';
import { Ticket } from './entities/ticket.entity';

export const TicketProvider = {
  provide: Providers.TICKET,
  useValue: Ticket,
};
