import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { UserProvider } from 'src/modules/user/user.providers';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailService } from 'src/modules/verify-email/verify-email.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('JwtSecret'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, VerifyEmailService],
})
export class AuthModule {}