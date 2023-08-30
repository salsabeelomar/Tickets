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

import { ResponseInterceptor } from './common/interceptor/Response.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule, {
    logger: new WinstonLogger(),
  });

  const jwt = app.get<JwtService>(JwtService);
  const userService = app.get<UserService>(UserService);
  const reflector = app.get<Reflector>(Reflector);
  const configService = app.get<ConfigService>(ConfigService);

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

  await app.listen(configService.get('Port'));
}
bootstrap();
