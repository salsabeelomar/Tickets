import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from '../user/user.module';
import { NotificationService } from './notification.gateway';

@Module({
  imports: [
    UserModule,
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
  ],
  providers: [NotificationService],
})
export class NotificationModule {}
