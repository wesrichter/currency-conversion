import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/entities/authenticated-request.entity';
import { Context } from 'src/entities/context.entity';

export const ContextDecorator = createParamDecorator((_: unknown, ctx: ExecutionContext): Context => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.ctx;
});
