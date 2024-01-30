import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ChatModule } from './chat.module';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_CHAT_QUEUE');
  const port = configService.get('CHAT_PORT');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
