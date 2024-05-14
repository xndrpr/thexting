import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly $jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies['access-token'];

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const session = this.$jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      request['session'] = session;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
