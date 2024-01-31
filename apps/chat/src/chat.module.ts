import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'apps/user/src/user.module';
import {
  Chat,
  Conversation,
  DbModule,
  RedisModule,
  SharedModule,
  User,
} from '@app/shared';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConversationsRepository } from '@app/shared/repositories/conversation.repository';

@Module({
  imports: [
    DbModule,
    RedisModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    UserModule,
    TypeOrmModule.forFeature([User, Chat, Conversation]),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    {
      provide: 'ConversationsRepositoryInterface',
      useClass: ConversationsRepository,
    },
  ],
})
export class ChatModule {}
