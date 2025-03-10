import { Module } from '@nestjs/common';
import { CoinbaseModule } from 'src/clients/coinbase/coinbase.module';
import { CurrencyService } from 'src/currency/currency.service';
import { CurrencyController } from '../currency/currency.handler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/clients/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoinbaseModule,
    RedisModule,
  ],
  controllers: [AppController, CurrencyController],
  providers: [AppService, CurrencyService],
})
export class AppModule {}
