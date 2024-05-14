import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/dto/SignIn.dto';
import { SignUpDto } from 'src/dto/SignUp.dto';
import { TokensDto } from 'src/dto/Tokens.dto';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { SessionDto } from 'src/dto/Session.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly $jwt: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async signUp(dto: SignUpDto): Promise<TokensDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (user) {
      throw new BadRequestException({ type: 'email-exists' });
    }

    const newUser = await this.usersService.createUser(dto);
    const accessToken = await this.$jwt.signAsync(
      { id: newUser.id, email: newUser.email },
      { expiresIn: '15m' },
    );
    const refreshToken = await this.$jwt.signAsync(
      { id: newUser.id, email: newUser.email },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException({ type: 'user-does-not-exist' });
    }
    const hash = this.passwordService.hashPassword(dto.password, user.salt);

    if (hash !== user.hash) {
      throw new BadRequestException({ type: 'invalid-credentials' });
    }

    const accessToken = await this.$jwt.signAsync(
      { id: user.id, email: user.email },
      { expiresIn: '15m' },
    );
    const refreshToken = await this.$jwt.signAsync(
      { id: user.id, email: user.email },
      { expiresIn: '14d' },
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const session: SessionDto = this.$jwt.verify(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    const accessToken = await this.$jwt.signAsync(
      {
        id: session.id,
        email: session.email,
      },
      { expiresIn: '15m' },
    );

    return { accessToken };
  }
}
