import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from 'src/dto/SignUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/SignIn.dto';
import { RefreshToken } from 'src/decorators/refresh-token.decorator';
import { CookieService } from './cookie.service';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { Session } from 'src/decorators/session.decorator';
import { SessionDto } from 'src/dto/Session.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private $service: AuthService,
    private cookieService: CookieService,
  ) {}

  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() user: SignUpDto,
  ) {
    const tokens = await this.$service.signUp(user);

    this.cookieService.addCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      message: 'Success',
      status: HttpStatus.CREATED,
      data: tokens.accessToken,
    };
  }

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() user: SignInDto,
  ) {
    const tokens = await this.$service.signIn(user);

    this.cookieService.addCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      message: 'Success',
      status: HttpStatus.OK,
      data: tokens.accessToken,
    };
  }

  @Post('sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeCookies(res);

    return {
      message: 'Success',
      status: HttpStatus.OK,
    };
  }

  @Get('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @RefreshToken() refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const session = await this.$service.refresh(refreshToken);

    this.cookieService.addAccessCookie(res, session.accessToken);

    return {
      message: 'Success',
      status: HttpStatus.OK,
      data: session.accessToken,
    };
  }

  @Get('session')
  @UseGuards(AuthGuard)
  async getSession(@Session() session: SessionDto) {
    return {
      message: 'Success',
      status: HttpStatus.OK,
      data: session,
    };
  }
}
