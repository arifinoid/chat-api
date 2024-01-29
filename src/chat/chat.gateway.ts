import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './services/chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/user.model';
import { UnauthorizedException } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { IRoom } from './chat.model';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

const CHAT_EVENT_NAME = 'chat';
const TYPING_EVENT_NAME = 'typing';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: IUser = await this.userService.getOne(decodedToken.user.id);
      if (!user) return this.disconnect(socket);

      socket.data.user = user;
      const rooms = this.roomService.findRoomsForUser(user.id, {
        page: 1,
        limit: 20,
      });

      return this.server.to(socket.id).emit('rooms', rooms);
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    this.disconnect(socket);
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: IRoom) {
    return this.roomService.createRoom(room, socket.data.user);
  }

  @SubscribeMessage('paginateRoom')
  async onPaginateRoom(socket: Socket, opt: IPaginationOptions) {
    const rooms = await this.roomService.findRoomsForUser(
      socket.data.user.id,
      opt,
    );

    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatService.create(createChatDto, client.id);
    this.server.emit(CHAT_EVENT_NAME, chat);
    return chat;
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('joinChat')
  joinChat(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.identify(name, client.id);
  }

  @SubscribeMessage('userTyping')
  async userTyping(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.chatService.getUserName(client.id);
    client.broadcast.emit(TYPING_EVENT_NAME, { name, isTyping });
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
