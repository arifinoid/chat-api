import { RoomEntity } from 'src/chat/entities/room.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowercase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
