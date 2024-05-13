import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Gender {
  Male,
  Female,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  age: number;

  @Column()
  dateOfBirth: Date;

  @Column()
  gender: Gender;

  @Column({ unique: true })
  email: string;

  @Column()
  salt: string;

  @Column()
  hash: string;
}
