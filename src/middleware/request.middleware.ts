import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RepositoryClient } from 'src/clients/repository/repository.client';
import { AuthenticatedRequest } from 'src/entities/authenticated-request.entity';

/**
 * Logs user requests and responses to the database.
 *
 * Why use `res.on('finish')`?
 * - The `finish` event ensures we log the request only after the response has been fully sent to the client.
 * - This prevents logging incomplete or incorrect response data that might be modified later in the request lifecycle.
 * - It avoids potential performance issues caused by awaiting database operations before the response is sent.
 * - Ensures accurate tracking of request/response interactions, particularly for auditing, debugging, and analytics purposes.
 */
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
