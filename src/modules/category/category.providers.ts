import { PROVIDER } from 'src/common/constant/providers.constant';
import { Category } from './models/category.model';

export const CategoryProvider = [
  {
    provide: PROVIDER.CATEGORY,
    useValue: Category,
  },
];
