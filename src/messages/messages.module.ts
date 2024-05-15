import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { Message } from 'src/db/entities/message.entity';
import { Chat } from 'src/db/entities/chat.entity';
import { PasswordService } from 'src/auth/password.service';
import { CookieService } from 'src/auth/cookie.service';
import { SocketsStoreService } from 'src/sockets-store/sockets-store.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Chat])],
  providers: [
    MessagesService,
    UsersService,
    PasswordService,
    CookieService,
    SocketsStoreService,
  ],
  controllers: [MessagesController],
})
export class MessagesModule {}
