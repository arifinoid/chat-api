import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './services/chat.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/user.model';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { IChat, IConnectedUser, IJoinedRoom, IRoom } from './chat.model';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ConnectedUserService } from './services/connected-user.service';
import { JoinedRoomService } from './services/joined-room.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }

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

      await this.connectedUserService.create({ socketId: socket.id, user });

      return this.server.to(socket.id).emit('rooms', rooms);
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    this.disconnect(socket);
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: IRoom) {
    const createdRoom: IRoom = await this.roomService.createRoom(
      room,
      socket.data.user,
    );

    for (const user of createdRoom.users) {
      const connections: IConnectedUser[] =
        await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });

      for (const connection of connections) {
        this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: IRoom) {
    const chats = await this.chatService.findChatsByRoom(room, {
      limit: 10,
      page: 1,
    });

    await this.joinedRoomService.create({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });
    this.server.to(socket.id).emit('chats', chats);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addChat')
  async onAddMessage(socket: Socket, chat: IChat) {
    const createdChat: IChat = await this.chatService.create({
      ...chat,
      user: socket.data.user,
    });
    const room: IRoom = await this.roomService.getRoom(createdChat.room.id);
    const joinedUsers: IJoinedRoom[] =
      await this.joinedRoomService.findByRoom(room);
    for (const user of joinedUsers) {
      this.server.to(user.socketId).emit('chatAdded', createdChat);
    }
  }

  @SubscribeMessage('paginateRoom')
  async onPaginateRoom(socket: Socket, opt: IPaginationOptions) {
    const rooms = await this.roomService.findRoomsForUser(
      socket.data.user.id,
      opt,
    );

    return this.server.to(socket.id).emit('rooms', rooms);
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
