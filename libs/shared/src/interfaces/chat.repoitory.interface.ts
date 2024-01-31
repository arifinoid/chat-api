import { BaseInterfaceRepository } from '@app/shared';

import { Chat } from '../entities/chat.entity';

export interface ChatsRepositoryInterface
  extends BaseInterfaceRepository<Chat> {}
