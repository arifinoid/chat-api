import { Controller, Inject } from '@nestjs/common';
import { SharedService, User } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.userService.getUsers();
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUserById(@Ctx() context: RmqContext, @Payload() id: User['id']) {
    this.sharedService.acknowledgeMessage(context);

    return this.userService.getUserById(id);
  }
}
