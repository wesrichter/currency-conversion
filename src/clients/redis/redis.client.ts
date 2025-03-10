import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisClient {
  private client = createClient({ url: 'redis://localhost:6379' });

  constructor() {
    this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    this.client.expire(key, seconds);
  }
}
