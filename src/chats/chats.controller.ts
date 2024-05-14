import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateChatDto } from 'src/dto/CreateChat.dto';
import { SessionDto } from 'src/dto/Session.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getChats(@Session() session: SessionDto) {
    return await this.chatsService.getChats(session.id);
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  async createChat(@Session() session: SessionDto, @Body() dto: CreateChatDto) {
    return await this.chatsService.createChat(session, dto);
  }
}
