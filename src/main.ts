import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { AppModule } from './app.module';
import { rabbitMQConfig } from './config/rabbitmq.config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { createDocument } from './config/swagger.config';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const { port } = configService.get<AppConfig>('app');

  app.use(json({ limit: '16kb' }));

  // CORS не настраиваем: сервис не вызывается браузером — он не проксируется
  // gateway'ем и работает только как потребитель notifications-queue.

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const rmqConfig = getRMQConfig(configService);

  app.connectMicroservice<MicroserviceOptions>(rmqConfig);

  createDocument(app);

  await app.startAllMicroservices();
  await app.listen(port);
}

function getRMQConfig(
  configService: ConfigService<unknown, boolean>,
): MicroserviceOptions {
  const rmqQueue = configService.get<string>('rmq.queue');
  const rmqUrl = configService.get<string>('rmq.url');

  const rmqConfig = rabbitMQConfig({
    queue: rmqQueue,
    urls: [rmqUrl],
  });

  return rmqConfig;
}

bootstrap();
