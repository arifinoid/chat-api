import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';

import {
  ChatsRepositoryInterface,
  ConversationsRepositoryInterface,
  User,
} from '@app/shared';
import { NewChatDTO } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject('ConversationsRepositoryInterface')
    private readonly convoRepo: ConversationsRepositoryInterface,
    @Inject('ChatRepositoryInterface')
    private readonly chatRepo: ChatsRepositoryInterface,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  private async getUser(id: number) {
    const obj = this.authService.send<User>(
      {
        cmd: 'get-user',
      },
      { id },
    );

    const user = await firstValueFrom(obj).catch((err) => console.error(err));

    return user;
  }

  async getConversations(userId: number) {
    const allConversations = await this.convoRepo.findWithRelations({
      relations: ['users'],
    });

    const userConversations = allConversations.filter((conversation) => {
      const userIds = conversation.users.map((user) => user.id);
      return userIds.includes(userId);
    });

    return userConversations.map((conversation) => ({
      id: conversation.id,
      userIds: (conversation?.users ?? []).map((user) => user.id),
    }));
  }

  async createConversation(userId: number, friendId: number) {
    const user = await this.getUser(userId);
    const friend = await this.getUser(friendId);

    if (!user || !friend) return;

    const conversation = await this.convoRepo.findConversation(
      userId,
      friendId,
    );

    if (!conversation)
      return await this.convoRepo.save({
        users: [user, friend],
      });

    return conversation;
  }

  async createMessage(userId: number, newChat: NewChatDTO) {
    const user = await this.getUser(userId);

    if (!user) return;

    const conversation = await this.convoRepo.findByCondition({
      where: [{ id: newChat.conversationId }],
      relations: ['users'],
    });

    if (!conversation) return;

    return await this.chatRepo.save({
      message: newChat.message,
      user,
      conversation,
    });
  }
}
