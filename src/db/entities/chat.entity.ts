import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  partner: User;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
