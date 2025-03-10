import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CoinbaseModule } from 'src/clients/coinbase/coinbase.module';
import { CurrencyService } from 'src/currency/currency.service';
import { CurrencyController } from '../currency/currency.handler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/clients/redis/redis.module';
import { RequestLoggerMiddleware } from 'src/middleware/request.middleware';
import { RepositoryModule } from 'src/clients/repository/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoinbaseModule,
    RedisModule,
    RepositoryModule,
  ],
  controllers: [AppController, CurrencyController],
  providers: [AppService, CurrencyService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
