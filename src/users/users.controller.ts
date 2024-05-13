import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { PasswordService } from 'src/auth/password.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('create')
  async create(@Body() user: CreateUserDto) {
    const salt = await this.passwordService.generateSalt();
    const hash = await this.passwordService.hashPassword(user.password, salt);
    return await this.usersService.createUser(user, hash, salt);
  }
}
