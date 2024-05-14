import { Controller, Get, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async getChats() {
    return this.chatsService.getChats();
  }

  @Post()
  async createChat() {
    return this.chatsService.createChat();
  }
}
