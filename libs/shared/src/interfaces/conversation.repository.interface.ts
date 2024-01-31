import { BaseInterfaceRepository } from '@app/shared';

import { Conversation } from '../entities/conversation.entity';

export interface ConversationsRepositoryInterface
  extends BaseInterfaceRepository<Conversation> {
  findConversation(
    userId: number,
    friendId: number,
  ): Promise<Conversation | undefined>;
}
