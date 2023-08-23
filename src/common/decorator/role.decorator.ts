import { SetMetadata } from '@nestjs/common';
import { Roles } from '../types/Roles.types';

export const Role = (...role: Roles[]) => SetMetadata('roles', role);
