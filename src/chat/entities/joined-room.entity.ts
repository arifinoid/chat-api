import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class JoinedRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => User, (user) => user.joinedRooms)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Room, (room) => room.joinedUsers)
  @JoinColumn()
  room: Room;
}
