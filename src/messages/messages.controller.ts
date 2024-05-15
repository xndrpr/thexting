import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from 'src/dto/CreateMessage.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionDto } from 'src/dto/Session.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly $service: MessagesService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createMessage(
    @Body() dto: CreateMessageDto,
    @Session() session: SessionDto,
  ) {
    return await this.$service.createMessage(dto, session.id);
  }
}
