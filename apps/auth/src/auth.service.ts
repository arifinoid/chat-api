import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser, User, UserJwt, UserRepositoryInterface } from '@app/shared';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

type LoginResponse = Omit<IUser, 'password'> & {
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepo: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: Readonly<CreateUserDto>): Promise<User> {
    const existingUser = await this.userRepo.findByCondition({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('account already exists!');
    }

    const hashedPassword = await this.hashPassword(user.password);
    const savedUser = await this.userRepo.save({
      email: user.email,
      username: user.username,
      password: hashedPassword,
    });

    delete savedUser.password;
    return savedUser;
  }

  async login({
    email,
    password,
  }: Readonly<LoginUserDto>): Promise<LoginResponse> {
    const user = await this.userRepo.findByCondition({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMatch = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException("password doesn't match!");
    }

    const jwt = await this.generateJwt(user);
    const { password: _, ...rest } = user;

    return { token: jwt, ...rest };
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) return;

    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async generateJwt(user: IUser): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  private async hashPassword(password: User['password']): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async comparePasswords(
    password: User['password'],
    storedPasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, storedPasswordHash);
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }
}
