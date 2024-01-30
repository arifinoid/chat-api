import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { ConnectedUser } from './connected-user.entity';
import { JoinedRoom } from './joined-room.entity';
import { Chat } from './chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => Room, (room) => room.users)
  rooms: Room[];

  @OneToMany(() => ConnectedUser, (connection) => connection.user)
  connections: ConnectedUser[];

  @OneToMany(() => JoinedRoom, (joinedRoom) => joinedRoom.room)
  joinedRooms: JoinedRoom[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowercase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
