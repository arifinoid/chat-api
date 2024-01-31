import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CacheService, UserJwt } from '@app/shared';
import { ChatService } from './chat.service';
import { firstValueFrom } from 'rxjs';
import { NewChatDTO } from './dto/create-chat.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    private readonly cache: CacheService,
    private readonly chatService: ChatService,
  ) {}

  async handleDisconnect(_: Socket) {
    console.log('Disconnect conversation...');
  }

  async handleConnection(socket: Socket) {
    const jwt = socket.handshake.headers.authorization ?? null;

    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }

    const obj = this.authService.send<UserJwt>({ cmd: 'decode-jwt' }, { jwt });
    const res = await firstValueFrom(obj).catch((err) => console.error(err));

    if (!res || !res?.user) {
      this.handleDisconnect(socket);
      return;
    }

    const { user } = res;

    socket.data.user = user;

    await this.setConversationUser(socket);
    await this.createConversations(socket, user.id);
    await this.getConversations(socket);
  }

  @SubscribeMessage('getConversations')
  async getConversations(socket: Socket) {
    const { user } = socket.data;
    if (!user) return;

    const conversations = await this.chatService.getConversations(user.id);

    this.server.to(socket.id).emit('getAllConversations', conversations);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, newMessage: NewChatDTO) {
    if (!newMessage) return;

    const { user } = socket.data;

    if (!user) return;

    const createdMessage = await this.chatService.createMessage(
      user.id,
      newMessage,
    );

    const friendId = createdMessage.conversation.users.find(
      (u) => u.id !== user.id,
    ).id;

    const friendDetails = await this.getFriendDetails(friendId);

    if (!friendDetails) return;

    const { id, message, user: creator, conversation } = createdMessage;

    this.server.to(friendDetails.socketId).emit('newMessage', {
      id,
      message,
      creatorId: creator.id,
      conversationId: conversation.id,
    });
  }

  @SubscribeMessage('ping')
  async ping(_: Socket) {
    console.log('Keep socket connection alive!');
  }

  private async createConversations(_: Socket, userId: number) {
    const ob2$ = this.authService.send(
      {
        cmd: 'get-friends-list',
      },
      {
        userId,
      },
    );

    const friends = await firstValueFrom(ob2$).catch((err) =>
      console.error(err),
    );

    friends.forEach(async (friend) => {
      await this.chatService.createConversation(userId, friend.id);
    });
  }

  private async setConversationUser(socket: Socket) {
    const user = socket.data?.user;

    if (!user || !user.id) return;

    const conversationUser = { id: user.id, socketId: socket.id };

    await this.cache.set(`conversationUser ${user.id}`, conversationUser);
  }
}
