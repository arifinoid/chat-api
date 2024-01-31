import { AuthGuard } from '@app/shared';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/auth/src/dto/create-user.dto';
import { LoginUserDto } from 'apps/auth/src/dto/login-user.dto';

@Controller()
export class ApiController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Get()
  getHome() {
    return {
      message: 'success',
    };
  }

  @UseGuards(AuthGuard)
  @Get('users')
  getUsers() {
    return this.userService.send({ cmd: 'get-users' }, {});
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
