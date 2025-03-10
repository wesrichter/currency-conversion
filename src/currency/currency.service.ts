import { BadRequestException, Injectable } from '@nestjs/common';
import { Currency, ExchangeRateOutput } from './currency.entity';
import { CoinbaseClient } from '../clients/coinbase/coinbase.client';
import { Context } from '../entities/context.entity';
import Decimal from 'decimal.js';

@Injectable()
export class CurrencyService {
  constructor(private readonly coinbase: CoinbaseClient) {}

  async getExchangeRate(
    ctx: Context,
    { from, to, amount }: { from: Currency; to: Currency; amount: string },
  ): Promise<ExchangeRateOutput> {
    this.validateExchangeRate({ from, to });

    const {
      data: { rates: exchangeRates },
    } = await this.coinbase.getExchangeRates(ctx, from);

    const exchangeAmount = new Decimal(amount);
    const rate = new Decimal(exchangeRates[to]);
    const conversion = exchangeAmount.times(rate);

    return {
      from: {
        amount,
        currency: from,
        rate: exchangeRates[from],
      },
      to: {
        amount: conversion.toString(),
        currency: to,
        rate: exchangeRates[to],
      },
    };
  }

  private validateExchangeRate({ from, to }: { from: Currency; to: Currency }): void {
    if (from === to) {
      throw new BadRequestException('From and to exchange currencies must be different');
    }
  }
}
