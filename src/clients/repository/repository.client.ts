import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Request } from '@prisma/client';

@Injectable()
export class RepositoryClient {
  constructor(private prisma: PrismaService) {}

  async upsertUser({ id }: { id: string }): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return this.prisma.user.create({
        data: { id },
      });
    }
    return existingUser;
  }

  async createRequest({
    userId,
    parameters,
    responseBody,
  }: {
    userId: string;
    parameters: any;
    responseBody: any;
  }): Promise<Request> {
    return this.prisma.request.create({
      data: {
        userId,
        parameters,
        responseBody,
      },
    });
  }
}
