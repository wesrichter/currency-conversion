import { Injectable } from '@nestjs/common';

export interface HealthCheck {
  status: string;
  statusCode: number;
  timestamp: string;
  results: string;
}

@Injectable()
export class AppService {
  health(): HealthCheck {
    return {
      status: 'success',
      statusCode: 200,
      timestamp: new Date().toISOString(),
      results: '💰💰 currency-conversion 💰💰',
    };
  }
}
