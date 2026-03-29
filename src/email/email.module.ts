import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { promises as dns } from 'dns';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: mailerModuleFactory,
      inject: [ConfigService],
    }),
  ],
})
export class EmailModule {}

async function mailerModuleFactory(config: ConfigService) {
  const host = config.get<string>('email.host');
  const port = config.get<number>('email.port');
  const { address } = await dns.lookup(host);

  return {
    transport: {
      host: address,
      port,
      secure: true,
      tls: { servername: host },
      auth: {
        user: config.get<string>('email.user'),
        pass: config.get<string>('email.password'),
      },
    },
    defaults: {
      from: `"No Reply" <${config.get<string>('email.from')}>`,
    },
    template: {
      dir: join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}
