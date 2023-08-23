import { Providers } from 'src/common/constant/providers.constant';
import { Tracking } from './entities/tracking.entity';

export const TrackingProvider = {
  provide: Providers.TRACKING,
  useValue: Tracking,
};
