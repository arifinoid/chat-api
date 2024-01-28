import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { IUser } from './user.model';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private authService: AuthService,
  ) {}
  async create(user: IUser) {
    const isUserExists = await this.isMailExist(user.email);
    if (isUserExists) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    } else {
      const passHash = await this.hashPassword(user.password);
      user.password = passHash;

      const createdUser = await this.userRepository.save(
        this.userRepository.create(user),
      );
      return this.findOne(createdUser.id);
    }
  }

  async login(user: IUser): Promise<string> {
    const foundUser: IUser = await this.findByEmail(user.email.toLowerCase());
    if (foundUser) {
      const matches: boolean = await this.validatePassword(
        user.password,
        foundUser.password,
      );
      if (matches) {
        const payload: IUser = await this.findOne(foundUser.id);
        return this.authService.generateJwt(payload);
      } else {
        throw new HttpException(
          'Login was not successfull, wrong credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException(
        'Login was not successfull, wrong credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<IUser>> {
    return paginate<User>(this.userRepository, options);
  }

  private async findByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  private async findOne(id: number): Promise<IUser> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async isMailExist(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return Boolean(user);
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    passHash: string,
  ): Promise<any> {
    return this.authService.comparePasswords(password, passHash);
  }
}
