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
import { SocketsStoreService } from 'src/sockets-store/sockets-store.service';

config();
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: '15m' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    CookieService,
    PasswordService,
    AuthService,
    UsersService,
    SocketsStoreService,
  ],
  controllers: [AuthController],
  exports: [CookieService, PasswordService],
})
export class AuthModule {}
