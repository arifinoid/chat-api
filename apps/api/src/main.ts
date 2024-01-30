import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const configService = new ConfigService();
  const port = configService.get<string>('API_PORT');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
