import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/db/entities/chat.entity';
import { Message } from 'src/db/entities/message.entity';
import { User } from 'src/db/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from 'src/auth/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User])],
  providers: [ChatsService, UsersService, PasswordService],
  controllers: [ChatsController],
})
export class ChatsModule {}
