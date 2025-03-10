import { Module } from '@nestjs/common';
import { RepositoryClient } from './repository.client';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  providers: [RepositoryClient, PrismaService],
  exports: [RepositoryClient],
})
export class RepositoryModule {}
