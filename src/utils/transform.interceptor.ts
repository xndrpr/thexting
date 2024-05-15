import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: any): any {
    return call$.pipe(map((data) => classToPlain(data)));
  }
}
