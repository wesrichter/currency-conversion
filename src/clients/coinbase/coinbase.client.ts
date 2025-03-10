import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { Currency } from 'src/currency/currency.entity';
import { Context } from 'src/entities/context.entity';
import { ExchangeRate } from './coinbase.entity';

@Injectable()
export class CoinbaseClient {
  baseUrl: string;
  constructor(private readonly http: HttpService) {
    this.baseUrl = `https://api.coinbase.com/v2`;
  }

  public async getExchangeRates(ctx: Context, currency: Currency): Promise<ExchangeRate> {
    return lastValueFrom(
      this.http.get<ExchangeRate>(`${this.baseUrl}/exchange-rates?currency=${currency}`).pipe(
        map((resp) => resp.data),
        catchError((err) => {
          throw err;
        }),
      ),
    );
  }
}
