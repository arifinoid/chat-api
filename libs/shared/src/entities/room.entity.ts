import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JoinedRoom } from './joined-room.entity';
import { Chat } from './chat.entity';
import { User } from './user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => JoinedRoom, (joinedRoom) => joinedRoom.room)
  joinedUsers: JoinedRoom[];

  @OneToMany(() => Chat, (chat) => chat.room)
  chats: Chat[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
