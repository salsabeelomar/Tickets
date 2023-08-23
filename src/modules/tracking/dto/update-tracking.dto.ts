import { PartialType } from '@nestjs/mapped-types';
import { CreateTracking } from './create-tracking.dto';

export class UpdateTrackingDto extends PartialType(CreateTracking) {}
