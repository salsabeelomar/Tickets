import { PROVIDER } from 'src/common/constant/providers.constant';
import { AssignmentTickets } from './models/assignment.model';

export const AssignmentProvider = [
  {
    provide: PROVIDER.ASSIGNMENT_TICKET,
    useValue: AssignmentTickets,
  },
];
