import { SetMetadata } from '@nestjs/common';
export const NotActive = () => SetMetadata('isActive', true);
