import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowercase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
