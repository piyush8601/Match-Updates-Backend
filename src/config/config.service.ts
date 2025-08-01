import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get mongoUri(): string {
    return this.config.get<string>('MONGODB_URI') ?? 'mongodb://localhost:27017';
  }

  get mongoDbName(): string {
    return this.config.get<string>('MONGODB_DB_NAME') ?? 'cricket-app';
  }

  get redisHost(): string {
    return this.config.get<string>('REDIS_HOST') ?? 'localhost';
  }

  get redisPort(): number {
    return this.config.get<number>('REDIS_PORT') ?? 6379;
  }

  get redisTTL(): number {
    return this.config.get<number>('REDIS_CACHE_TTL') ?? 10000;
  }

  get port(): number {
    return this.config.get<number>('PORT') ?? 3000;
  }
}
