import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { PasswordService } from 'src/auth/password.service';
import { Message } from 'src/db/entities/message.entity';
import { Chat } from 'src/db/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Chat])],
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
