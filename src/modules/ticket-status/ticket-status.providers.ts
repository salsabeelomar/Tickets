import { PROVIDER } from 'src/common/constant/providers.constant';
import { TicketStatus } from './models/ticket-status.model';

export const TicketStatusProvider = [
  {
    provide: PROVIDER.STATUS,
    useValue: TicketStatus,
  },
];
