import { Providers } from 'src/common/constant/providers.constant';
import { Feedback } from './entities/feedback.entity';

export const FeedbackProvider = {
  provide: Providers.FEEDBACK,
  useValue: Feedback,
};
