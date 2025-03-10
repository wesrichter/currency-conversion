import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RepositoryClient } from 'src/clients/repository/repository.client';
import { AuthenticatedRequest } from 'src/entities/authenticated-request.entity';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private repository: RepositoryClient) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      const userId = req.token.userId;
      const parameters = req.body;
      const responseBody = res.locals.responseBody;

      if (userId) {
        await this.repository.upsertUser({
          id: userId,
        });
        await this.repository.createRequest({
          userId,
          parameters,
          responseBody,
        });
      }
    });
    next();
  }
}
