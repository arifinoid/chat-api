import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  getHello(): Record<string, string> {
    return {
      message: 'Hello from chat api!',
    };
  }
}
