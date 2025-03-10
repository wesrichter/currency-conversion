import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { Currency, CurrencyPipe, ExchangeRateOutput, ExchangeRateOutputDto, ParseNumberPipe } from './currency.entity';
import { IdentityInterceptor } from 'src/interceptors/identity.interceptor';
import { ContextInterceptor } from 'src/interceptors/context.interceptor';
import { ContextDecorator } from 'src/decorators/context.decorator';
import { Context } from 'src/entities/context.entity';

@Controller({
  path: 'currency',
})
@UseInterceptors(IdentityInterceptor, ContextInterceptor)
export class CurrencyController {
  constructor(private readonly currency: CurrencyService) {}

  @Get('/exchange-rate')
  @ApiOperation({ operationId: 'getExchangeRate' })
  @ApiOkResponse({ type: ExchangeRateOutputDto })
  @ApiQuery({ name: 'from', description: 'The base currency code, e.g., USD' })
  @ApiQuery({ name: 'to', description: 'The target currency code, e.g., EUR' })
  @ApiQuery({ name: 'amount', description: 'The amount to convert', type: Number })
  async getExchangeRate(
    @ContextDecorator() ctx: Context,
    @Query('from', CurrencyPipe) from: Currency,
    @Query('to', CurrencyPipe) to: Currency,
    @Query('amount', ParseNumberPipe) amount: string,
  ): Promise<ExchangeRateOutput> {
    return this.currency.getExchangeRate(ctx, { from, to, amount });
  }
}
