import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  chats: Chat[] = [{ id: 1, name: 'slamet', text: 'hello' }];
  user: Record<string, any> = {};

  create(createChatDto: CreateChatDto, clientId: Socket['id']) {
    const chat = {
      id: this.user[clientId].length,
      name: this.user[clientId],
      text: createChatDto.text,
    };
    this.chats.push(chat);

    return chat;
  }

  findAll() {
    return this.chats;
  }

  getUserName(clientId: Socket['id']) {
    return this.user[clientId];
  }

  identify(name: string, clientId: Socket['id']) {
    this.user[clientId] = name;
    return Object.values(this.user);
  }

  joinChat() {
    return `This action allows user to join specific chat room`;
  }

  userTyping() {
    return `This action tells user that specific user is typing`;
  }
}
