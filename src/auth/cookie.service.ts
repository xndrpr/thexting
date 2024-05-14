import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  static access = 'access-token';
  static refresh = 'refresh-token';

  addAccessCookie(res: Response, token: string) {
    res.cookie(CookieService.access, token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
  }

  addCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(CookieService.access, accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie(CookieService.refresh, refreshToken, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
  }

  removeCookie(res: Response) {
    res.clearCookie(CookieService.access);
  }

  removeCookies(res: Response) {
    res.clearCookie(CookieService.access);
    res.clearCookie(CookieService.refresh);
  }
}
