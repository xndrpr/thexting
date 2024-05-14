import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  users: User[];

  @OneToMany(() => Message, (message) => message.chat, { cascade: true })
  messages: Message[];
}
