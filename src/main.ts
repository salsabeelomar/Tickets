import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from './common/filters/httpFilter.filters';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { WinstonLogger } from './common/logger/winston.logger';
import { RoleGuard } from './common/guard/Role.guard';
import { AuthGuard } from './common/guard/Auth.guard';
import { UserService } from './modules/user/user.service';
import { ActiveGuard } from './common/guard/Active.guard';
import { Swagger } from './common/utils/Swagger';
import { CronJob } from 'cron';
import { TrackingService } from './modules/tracking/tracking.service';
import { ResponseInterceptor } from './common/interceptor/Response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule, {
    logger: new WinstonLogger(),
  });
  const trackingService = app.get<TrackingService>(TrackingService);

  const jwt = app.get<JwtService>(JwtService);
  const userService = app.get<UserService>(UserService);
  const reflector = app.get<Reflector>(Reflector);

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  app.useGlobalGuards(new AuthGuard(jwt, userService, reflector));
  app.useGlobalGuards(new RoleGuard(reflector));
  app.useGlobalGuards(new ActiveGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api/v1');
  Swagger(app);
  // const job = new CronJob('00 00 12 * * *', async () => {
  //   await trackingService.getLateSchedule();
  // });
  // job.start();
  await app.listen(3000);
}
bootstrap();
