import { BadRequestException, Injectable } from '@nestjs/common';
import { Currency } from './currency.entity';
import { CoinbaseClient } from 'src/clients/coinbase/coinbase.client';
import { Context } from 'src/entities/context.entity';

@Injectable()
export class CurrencyService {
  constructor(private readonly coinbase: CoinbaseClient) {}

  async getExchangeRate(ctx: Context, { from, to }: { from: Currency; to: Currency }) {
    this.validateExchangeRate({ from, to });
    const {
      data: { rates: exchangeRates },
    } = await this.coinbase.getExchangeRates(ctx, from);
    return { from: exchangeRates[from], to: exchangeRates[to] };
  }

  private validateExchangeRate({ from, to }: { from: Currency; to: Currency }): void {
    if (from === to) {
      throw new BadRequestException('From and to exchange currencies must be different');
    }
  }
}
