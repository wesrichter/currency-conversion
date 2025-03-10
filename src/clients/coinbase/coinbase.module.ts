import { Module } from '@nestjs/common';
import { CoinbaseClient } from './coinbase.client';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CoinbaseClient],
  exports: [CoinbaseClient],
})
export class CoinbaseModule {}
