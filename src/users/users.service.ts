import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/auth/password.service';
import { User } from 'src/db/entities/user.entity';
import { SignUpDto } from 'src/dto/SignUp.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(dto: SignUpDto): Promise<User> {
    const salt = this.passwordService.createSalt();
    const hash = this.passwordService.hashPassword(dto.password, salt);

    const newUser = this.userRepository.create({
      ...dto,
      hash: hash,
      salt: salt,
    });
    return this.userRepository.save(newUser);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
