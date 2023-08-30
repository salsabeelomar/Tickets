import { PROVIDER } from 'src/common/constant/providers.constant';
import { User } from './models/user.model';

export const UserProvider = [
  {
    provide: PROVIDER.USER,
    useValue: User,
  },
];
