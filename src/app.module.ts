import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

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
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './modules/notifacition/notification.module';

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
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    VerifyEmailModule,
    TicketModule,
    TrackingModule,
    DashboardModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
