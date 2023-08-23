import { Module } from '@nestjs/common';
import { VerifyEmailService } from './verify-email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: 'alnajjarsalsabeel7@gmail.com',
            pass: 'rsknilxgbsyvcgfd',
          },
        },
        defaults: {
          from: 'alnajjarsalsabeel7@gmail.com',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [VerifyEmailService],
})
export class VerifyEmailModule {}
