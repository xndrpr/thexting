import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookiesService {
  addCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
  }

  addCookies(res: Response, jwt: string, refresh: string) {
    res.cookie('access_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
  }

  removeCookie(res: Response) {
    res.clearCookie('access_token');
  }

  removeCookies(res: Response) {
    res.clearCookie('jwt');
    res.clearCookie('refersh_token');
  }
}
