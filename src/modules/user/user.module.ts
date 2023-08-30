import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProvider } from './user.providers';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
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
  controllers: [UserController],
  providers: [UserService, ...UserProvider],
  exports: [UserService, ...UserProvider],
})
export class UserModule {}
