import { PROVIDER } from 'src/common/constant/providers.constant';
import { Feedback } from './models/feedback.model';

export const FeedbackProvider = [
  {
    provide: PROVIDER.FEEDBACK,
    useValue: Feedback,
  },
];
