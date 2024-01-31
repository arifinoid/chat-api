import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq('USER_SERVICE', process.env.RABBITMQ_USER_QUEUE),
  ],
  controllers: [ApiController],
})
export class ApiModule {}
