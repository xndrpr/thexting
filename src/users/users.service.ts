import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  createUser(user: CreateUserDto, hash: string, salt: string) {
    const newUser = this.userRepository.create({
      ...user,
      hash: hash,
      salt: salt
    });
    return this.userRepository.save(newUser);
  }
}
