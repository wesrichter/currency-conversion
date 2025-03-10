import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.handler';
import { CurrencyService } from './currency.service';
import { Currency, ExchangeRateOutput } from './currency.entity';
import { Context } from '../entities/context.entity';
import { IdentityInterceptor } from '../interceptors/identity.interceptor';
import { ContextInterceptor } from '../interceptors/context.interceptor';
import { BadRequestException } from '@nestjs/common';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let service: CurrencyService;

  const mockContext: Context = {
    userId: '12345',
  };

  const mockExchangeRateOutput: ExchangeRateOutput = {
    from: {
      amount: '10',
      currency: Currency.USD,
      rate: '1',
    },
    to: {
      amount: '8.5',
      currency: Currency.EUR,
      rate: '0.85',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useValue: {
            getExchangeRate: jest.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(IdentityInterceptor)
      .useValue({ intercept: jest.fn().mockImplementation((context, next) => next.handle()) })
      .overrideInterceptor(ContextInterceptor)
      .useValue({ intercept: jest.fn().mockImplementation((context, next) => next.handle()) })
      .compile();

    controller = module.get<CurrencyController>(CurrencyController);
    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getExchangeRate', () => {
    it('should call currency service with correct parameters', async () => {
      jest.spyOn(service, 'getExchangeRate').mockResolvedValue(mockExchangeRateOutput);

      const result = await controller.getExchangeRate(mockContext, Currency.USD, Currency.EUR, '10');

      expect(service.getExchangeRate).toHaveBeenCalledWith(mockContext, {
        from: Currency.USD,
        to: Currency.EUR,
        amount: '10',
      });
      expect(result).toEqual(mockExchangeRateOutput);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Service error');
      jest.spyOn(service, 'getExchangeRate').mockRejectedValue(serviceError);

      await expect(controller.getExchangeRate(mockContext, Currency.USD, Currency.EUR, '10')).rejects.toThrow(
        serviceError,
      );
    });
  });
});
