import { Injectable } from '@nestjs/common';
import { pbkdf2Sync, randomBytes } from 'crypto';

@Injectable()
export class PasswordService {
  hashPassword(password: string, sault: string) {
    return pbkdf2Sync(password, sault, 1000, 54, 'sha512').toString('hex');
  }

  createSalt() {
    return randomBytes(16).toString('hex');
  }
}
