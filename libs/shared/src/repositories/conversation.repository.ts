import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Conversation } from '../entities/conversation.entity';
import { ConversationsRepositoryInterface } from '../interfaces/conversation.repository.interface';
import { BaseAbstractRepository } from './base.repository';

@Injectable()
export class ConversationsRepository
  extends BaseAbstractRepository<Conversation>
  implements ConversationsRepositoryInterface
{
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationEntity: Repository<Conversation>,
  ) {
    super(conversationEntity);
  }

  public async findConversation(
    userId: number,
    friendId: number,
  ): Promise<Conversation | undefined> {
    return await this.conversationEntity
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orWhere('user.id = :friendId', { friendId })
      .groupBy('conversation.id')
      .having('COUNT(*) > 1')
      .getOne();
  }
}
