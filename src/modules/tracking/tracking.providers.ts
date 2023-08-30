import { PROVIDER } from 'src/common/constant/providers.constant';
import { Tracking } from './models/tracking.model';

export const TrackingProvider = [
  {
    provide: PROVIDER.TRACKING,
    useValue: Tracking,
  },
];
