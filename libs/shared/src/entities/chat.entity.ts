import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Conversation } from './conversation.entity';
import { User } from './user.entity';

@Entity('message')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.chats)
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}
