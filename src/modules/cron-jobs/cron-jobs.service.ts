import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WinstonLogger } from 'src/common/logger/winston.logger';
import { TrackingService } from '../tracking/tracking.service';
import { STATUS } from 'src/common/types/status.types';
import { throwError } from 'rxjs';

@Injectable()
export class CronJobsService {
  private readonly logger = new WinstonLogger();
  constructor(private readonly trackingService: TrackingService) {}
  @Cron('0 * * * * *')
  async getLateAssign() {
    try {
      this.logger.log(`Cron job for Late Assigned start At : ${new Date()}`);
      await this.trackingService.getLogicOfLate(STATUS.ASSIGNED);
      this.logger.log(`Cron job for Late Assigned finished At : ${new Date()}`);
    } catch (error) {}
  }
  @Cron('0 * * * * *')
  async getLateSchedule() {
    try {
      this.logger.log(`Cron job for Late Schedule start At : ${new Date()}`);
      await this.trackingService.getLogicOfLate(STATUS.SCHEDULED);
      this.logger.log(`Cron job for Late Schedule finished At : ${new Date()}`);
    } catch (error) {}
  }
}
