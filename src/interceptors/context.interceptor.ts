import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest();
    const { protocol, hostname, url, headers, token } = request;
    request.ctx = {
      request: {
        id: uuid(),
        url: url,
        protocol: protocol,
        hostname: hostname,
        headers: headers,
      },
      userId: token.userId,
    };
    return next.handle();
  }
}
