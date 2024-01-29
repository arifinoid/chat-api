import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUser } from '../entities/connected-user.entity';
import { Repository } from 'typeorm';
import { IConnectedUser } from '../chat.model';
import { IUser } from 'src/user/user.model';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUser)
    private readonly connectedUserRepo: Repository<ConnectedUser>,
  ) {}

  async create(connectedUser: IConnectedUser): Promise<IConnectedUser> {
    return await this.connectedUserRepo.save(connectedUser);
  }

  async findByUser(user: IUser): Promise<IConnectedUser[]> {
    return await this.connectedUserRepo.find({
      where: { user },
    });
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepo.delete({ socketId });
  }

  async deleteAll() {
    return await this.connectedUserRepo.createQueryBuilder().delete().execute();
  }
}
