import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { VerifyEmailModule } from './modules/verify-email/verify-email.module';
import { TicketModule } from './modules/ticket/ticket.module';
import config from 'config/index.config';
import { TrackingModule } from './modules/tracking/tracking.module';
import { NotificationModule } from './modules/notification/notification.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { TicketEmitterModule } from './modules/ticket-emitter/ticket-emitter.module';
import { CategoryModule } from './modules/category/category.module';
import { TagsModule } from './modules/tags/tags.module';
import { SupportStaffModule } from './modules/support-staff/support-staff.module';
import { AssignmentTicketModule } from './modules/assignment-ticket/assignment-ticket.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [config[0]],
      isGlobal: true,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 1000,
      isGlobal: true,
    }),
    CategoryModule,
    AuthModule,
    UserModule,
    VerifyEmailModule,
    TicketModule,
    TrackingModule,
    NotificationModule,
    TicketEmitterModule,
    FeedbacksModule,
    SupportStaffModule,
    TagsModule,
    AssignmentTicketModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
