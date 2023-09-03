import { PROVIDER } from 'src/common/constant/providers.constant';
import { SupportStaff } from './models/support-staff.model';

export const supportProvider = [
  {
    provide: PROVIDER.STAFF,
    useValue: SupportStaff,
  },
];
