import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinedRoom } from '../entities/joined-room.entity';
import { IJoinedRoom, IRoom } from '../chat.model';
import { IUser } from 'src/user/user.model';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(JoinedRoom)
    private readonly joinedRoomRepo: Repository<JoinedRoom>,
  ) {}

  async create(joinedRoom: IJoinedRoom): Promise<IJoinedRoom> {
    return this.joinedRoomRepo.save(joinedRoom);
  }

  async findByUser(user: IUser): Promise<IJoinedRoom[]> {
    return this.joinedRoomRepo.find({ where: { user } });
  }

  async findByRoom(room: IRoom): Promise<IJoinedRoom[]> {
    return this.joinedRoomRepo.find({
      where: { room },
    });
  }

  async deleteBySocketId(socketId: string) {
    return this.joinedRoomRepo.delete({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomRepo.createQueryBuilder().delete().execute();
  }
}
