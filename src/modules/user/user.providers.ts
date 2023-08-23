import { Providers } from 'src/common/constant/providers.constant';
import { User } from './entities/user.entity';

export const UserProvider = {
  provide: Providers.USER,
  useValue: User,
};
