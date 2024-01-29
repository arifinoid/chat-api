import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Chat } from '../entities/chat.entity';
import { IChat, IRoom } from '../chat.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
  ) {}

  async create(chat: IChat): Promise<IChat> {
    return this.chatRepo.save(this.chatRepo.create(chat));
  }

  async findChatsByRoom(
    room: IRoom,
    options: IPaginationOptions,
  ): Promise<Pagination<IChat>> {
    const q = this.chatRepo
      .createQueryBuilder('chat')
      .leftJoin('chat.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('chat.user', 'user')
      .orderBy('chat.created_at', 'DESC');

    return paginate(q, options);
  }
}
