import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/db/entities/chat.entity';
import { Message } from 'src/db/entities/message.entity';
import { CreateMessageDto } from 'src/dto/CreateMessage.dto';
import { UsersService } from 'src/users/users.service';
import { SocketsStoreService } from 'src/sockets-store/sockets-store.service';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,

    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createMessage(dto: CreateMessageDto, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException({ type: 'user-not-found' });
    }

    const chat = await this.chatsRepository.findOne({
      where: { id: dto.chat },
      relations: ['user', 'partner', 'lastMessage'],
    });
    if (!chat) {
      throw new BadRequestException({ type: 'chat-not-found' });
    }

    if (chat.user.id !== user.id && chat.partner.id !== user.id) {
      throw new BadRequestException({ type: 'user-not-in-chat' });
    }

    const message = new Message();
    message.text = dto.text;
    message.user = user;
    message.chat = chat;
    if (dto.reply) {
      const reply = await this.messagesRepository.findOne({
        where: { id: dto.reply },
      });
      if (!reply) {
        throw new BadRequestException({ type: 'reply-not-found' });
      }
      message.reply = reply;
    }

    const savedMessage = this.messagesRepository.create(message);
    const socket1 = SocketsStoreService.getSocketByUserId(chat.user.id);
    const socket2 = SocketsStoreService.getSocketByUserId(chat.partner.id);

    chat.lastMessage = savedMessage;

    await this.chatsRepository.save(chat);
    this.eventEmitter.emit(
      'message.created',
      savedMessage,
      [socket1, socket2],
      chat.id,
    );
  }
}
