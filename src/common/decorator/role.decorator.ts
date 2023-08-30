import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../types/Roles.types';

export const Role = (...role: ROLES[]) => SetMetadata('roles', role);
