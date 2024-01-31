import { Chat } from '@app/shared/entities/chat.entity';

export class CreateChatDto extends Chat {}
export class NewChatDTO {
  message: string;
  conversationId: number;
  friendId: number;
}
