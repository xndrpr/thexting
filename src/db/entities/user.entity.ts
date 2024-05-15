import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Gender {
  Male,
  Female,
}

export enum Role {
  User = 'user',
  Partner = 'partner',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  dateOfBirth: string;

  @Column()
  gender: Gender;

  @Column({ unique: true })
  email: string;

  @Column({ default: Role.User })
  role: Role;

  @Column()
  @Exclude()
  salt: string;

  @Column()
  @Exclude()
  hash: string;
}
