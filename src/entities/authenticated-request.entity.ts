import { Request } from 'express';
import { Context } from './context.entity';

export type AuthenticatedRequest = Request & {
  ctx: Context;
  token: {
    userId: string;
  };
};
