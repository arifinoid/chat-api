import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Chat } from './chat.entity';
import { User } from './user.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Chat, (chat) => chat.conversation)
  chats: Chat[];

  @UpdateDateColumn()
  lastUpdated: Date;
}
