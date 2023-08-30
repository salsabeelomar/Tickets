import { PROVIDER } from 'src/common/constant/providers.constant';
import { Tags } from './models/tag.model';

export const TagProviders = [
  {
    provide: PROVIDER.TAGS,
    useValue: Tags,
  },
];
