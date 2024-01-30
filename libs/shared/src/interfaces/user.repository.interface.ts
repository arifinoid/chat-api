import { User } from '../entities/user.entity';
import { BaseInterfaceRepository } from '../repositories/base.interface.repository';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<User> {}
