import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { config } from 'dotenv';

config();
console.log(process.env.JWT_SECRET);
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: '15m' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [CookieService, PasswordService, AuthService, UsersService],
  controllers: [AuthController],
  exports: [CookieService, PasswordService],
})
export class AuthModule {}
