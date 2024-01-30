import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ILoginResponse, IUser } from './user.model';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    const jwt = await this.userService.login(loginUserDto);
    return {
      access_token: jwt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({ page, limit });
  }

  @UseGuards(JwtAuthGuard)
  @Get('username')
  async findByUsername(@Query('username') username: string): Promise<IUser[]> {
    return this.userService.findByUsername(username);
  }
}
