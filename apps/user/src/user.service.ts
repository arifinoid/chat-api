import { Inject, Injectable } from '@nestjs/common';
import { User, UserRepositoryInterface } from '@app/shared';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepo: UserRepositoryInterface,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepo.findAll();
  }

  async getUserById(id: User['id']): Promise<User> {
    return await this.userRepo.findOneById(id);
  }

  async findByEmail(email: User['email']): Promise<User> {
    return this.userRepo.findByCondition({
      where: { email },
      select: ['id', 'email', 'password', 'username'],
    });
  }

  async findById(id: User['id']): Promise<User> {
    return this.userRepo.findOneById(id);
  }
}
