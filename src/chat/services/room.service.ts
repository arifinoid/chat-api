import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../entities/room.entity';
import { Repository } from 'typeorm';
import { IRoom } from '../chat.model';
import { IUser } from 'src/user/user.model';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepo: Repository<RoomEntity>,
  ) {}

  async createRoom(room: IRoom, creator: IUser) {
    const newRoom = room.users.concat(creator);
    return await this.roomRepo.save(newRoom);
  }

  async findRoomsForUser(
    userId: IUser['id'],
    options: IPaginationOptions,
  ): Promise<Pagination<IRoom>> {
    const q = this.roomRepo
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC');

    return paginate(q, options);
  }
}
