import { PROVIDER } from 'src/common/constant/providers.constant';
import { Ticket } from './models/ticket.model';

export const TicketProvider = [
  {
    provide: PROVIDER.TICKET,
    useValue: Ticket,
  },
];
