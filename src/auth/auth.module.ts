import { Module } from '@nestjs/common';
import { CookiesService } from './cookies.service';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [CookiesService, PasswordService, AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
