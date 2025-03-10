import { createZodDto } from 'nestjs-zod';
import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { z } from 'zod';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  BTC = 'BTC',
  ETH = 'ETH',
}

@Injectable()
export class CurrencyPipe implements PipeTransform {
  transform(value: any) {
    if (!Object.values(Currency).includes(value)) {
      throw new BadRequestException(`Invalid currency code: ${value}`);
    }
    return value;
  }
}

@Injectable()
export class ParseNumberPipe implements PipeTransform {
  transform(value: string) {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue) || numberValue < 0) {
      throw new BadRequestException('Amount must be a non-negative number');
    }
    return value;
  }
}

const ExchangeRateOutputSchema = z.object({
  from: z.nativeEnum(Currency),
  to: z.nativeEnum(Currency),
  amount: z.number(),
});

export type ExchangeRateOutput = z.infer<typeof ExchangeRateOutputSchema>;
export class ExchangeRateOutputDto extends createZodDto(ExchangeRateOutputSchema) {}
