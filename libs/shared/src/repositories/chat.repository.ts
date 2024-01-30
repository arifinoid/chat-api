import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { BaseAbstractRepository } from './base.repository';

@Injectable()
export class MessagesRepository extends BaseAbstractRepository<Chat> {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
  ) {
    super(chatRepo);
  }
}
