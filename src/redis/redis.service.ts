import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async setObject(key: string, value: any, ttl?: number): Promise<void> {
        const serialized = JSON.stringify(value);
        await this.set(key, serialized, ttl);
    }

    async getObject<T>(key: string): Promise<T | null> {
        const value = await this.get(key);
        return value ? JSON.parse(value) : null;
    }

    async lpush(key: string, ...values: string[]): Promise<number> {
        return await this.client.lpush(key, ...values);
    }

    async lrange(key: string, start: number, stop: number): Promise<string[]> {
        return await this.client.lrange(key, start, stop);
    }

    async ltrim(key: string, start: number, stop: number): Promise<string> {
        return await this.client.ltrim(key, start, stop);
    }

    async del(key: string): Promise<number> {
        return await this.client.del(key);
    }

    onModuleDestroy() {
        this.client.disconnect();
    }
}
