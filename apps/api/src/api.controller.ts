import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/auth/src/dto/create-user.dto';
import { LoginUserDto } from 'apps/auth/src/dto/login-user.dto';

@Controller()
export class ApiController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get()
  getHome() {
    return {
      message: 'success',
    };
  }

  @Get('users')
  getUsers() {
    return this.authService.send({ cmd: 'get-users' }, {});
  }

  @Post('auth/register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.send(
      {
        cmd: 'register',
      },
      user,
    );
  }

  @Post('auth/login')
  async login(@Body() user: LoginUserDto) {
    return this.authService.send(
      {
        cmd: 'login',
      },
      user,
    );
  }
}
