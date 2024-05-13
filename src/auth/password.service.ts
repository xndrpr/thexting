import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hash: string,
    salt: string,
  ): Promise<boolean> {
    return bcrypt.compare(await bcrypt.hash(password, salt), hash);
  }
}
