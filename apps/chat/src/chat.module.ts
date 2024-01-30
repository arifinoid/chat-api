import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './services/chat.service';
import { RoomService } from './services/room.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { ConnectedUserService } from './services/connected-user.service';
import { ConnectedUser } from './entities/connected-user.entity';
import { JoinedRoomService } from './services/joined-room.service';
import { JoinedRoom } from './entities/joined-room.entity';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Room, ConnectedUser, JoinedRoom, Chat]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    RoomService,
    ConnectedUserService,
    JoinedRoomService,
  ],
})
export class ChatModule {}
