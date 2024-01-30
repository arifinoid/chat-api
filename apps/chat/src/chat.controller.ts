import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller()
export class AppController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getHello(): Record<string, string> {
    return this.chatService.getHello();
  }
}
