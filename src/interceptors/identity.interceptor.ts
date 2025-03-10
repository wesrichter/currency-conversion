import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import * as moment from 'moment';
import { AuthenticatedRequest } from '../entities/authenticated-request.entity';
import { RedisClient } from '../clients/redis/redis.client';

@Injectable()
export class IdentityInterceptor implements NestInterceptor {
  constructor(private readonly redis: RedisClient) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.headers.authorization?.split(' ').pop();
    if (!token) {
      throw new UnauthorizedException('No auth token present in header');
    }

    const decodedToken = this.decodeToken(token);
    const userId = decodedToken.userId;
    if (!userId) {
      throw new UnauthorizedException('Invalid token: Missing userId');
    }

    await this.checkRequestLimit(userId);

    request.token = decodedToken;
    return next.handle();
  }

  private decodeToken(token: string) {
    try {
      const decoded = decode(token) as { userId: string };
      if (!decoded?.userId) throw new UnauthorizedException('Invalid token format');
      return decoded;
    } catch (e) {
      throw new UnauthorizedException('Unable to verify auth token');
    }
  }

  private async checkRequestLimit(userId: string) {
    const currentDate = moment().format('YYYY-MM-DD');
    const redisKey = `request-count:${userId}:${currentDate}`;
    const isWeekend = moment().isoWeekday() > 5;
    const limit = isWeekend ? 200 : 100;

    const requestCount = parseInt((await this.redis.get(redisKey)) ?? '0');
    if (requestCount >= limit) {
      throw new ForbiddenException(`Request limit exceeded: ${limit} requests per day`);
    }

    await this.redis.incr(redisKey);
    await this.redis.expire(redisKey, 86400);
  }
}
