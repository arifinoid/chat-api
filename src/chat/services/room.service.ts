import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
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
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  async createRoom(room: IRoom, creator: IUser) {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.roomRepo.save(newRoom);
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

  async getRoomsForUser(
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

  async getRoom(roomId: IRoom['id']): Promise<IRoom> {
    return this.roomRepo.findOne({
      where: { id: roomId },
      relations: ['users'],
    });
  }

  async addCreatorToRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    room.users.concat(creator);
    return room;
  }
}
