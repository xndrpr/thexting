import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/db/entities/chat.entity';
import { CreateChatDto } from 'src/dto/CreateChat.dto';
import { SessionDto } from 'src/dto/Session.dto';
import { SocketsStoreService } from 'src/sockets-store/sockets-store.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getChats(userId: number) {
    try {
      return await this.chatRepository.find({
        where: [
          { user: await this.usersService.findById(userId) },
          { partner: await this.usersService.findById(userId) },
        ],
        relations: ['user', 'partner', 'lastMessage'],
      });
    } catch {
      return [];
    }
  }

  async getChat(session: SessionDto, chatId: number) {
    const chat = await this.chatRepository.findOne({
      where: [
        { id: chatId, user: await this.usersService.findById(session.id) },
        { id: chatId, partner: await this.usersService.findById(session.id) },
      ],
      relations: ['messages', 'messages.user', 'user', 'partner'],
    });

    if (!chat) {
      throw new BadRequestException({ type: 'chat-not-found' });
    }

    return chat;
  }

  async createChat(session: SessionDto, dto: CreateChatDto) {
    if (session.id === dto.partner) {
      throw new BadRequestException({ type: 'chat-with-self' });
    }

    const partner = await this.usersService.findById(dto.partner);
    if (!partner) {
      throw new BadRequestException({ type: 'partner-not-found' });
    }

    const user = await this.usersService.findById(session.id);
    if (!user) {
      throw new BadRequestException({ type: 'user-not-found' });
    }

    const chat = await this.chatRepository.findOne({
      where: [
        { user: user, partner: partner },
        { user: partner, partner: user },
      ],
    });
    if (chat) {
      throw new BadRequestException({ type: 'chat-exists' });
    }

    const newChat = {
      ...dto,
      user: user,
      partner: partner,
    };

    await this.chatRepository.save(newChat);

    const socket1 = SocketsStoreService.getSocketByUserId(user.id);
    const socket2 = SocketsStoreService.getSocketByUserId(partner.id);

    this.eventEmitter.emit('chat.created', newChat, [socket1, socket2]);
  }
}
