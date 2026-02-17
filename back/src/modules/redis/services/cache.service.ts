import { Injectable, Inject } from "@nestjs/common";
import type { IRedisClient } from "../client/interfaces/redis-client.interface";
import { REDIS_MODULE_TOKENS } from "../constants/redis-tokens.constants";
import type { ICacheService } from "./interfaces/cache-service.interface";

@Injectable()
export class CacheService implements ICacheService {
    constructor(
        @Inject(REDIS_MODULE_TOKENS.REDIS_CLIENT)
        private readonly redisClient: IRedisClient
    ) {}

    async get(key: string): Promise<string | null> {
        return this.redisClient.getClient().get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        const client = this.redisClient.getClient();
        if (ttlSeconds != null) {
            await client.set(key, value, "EX", ttlSeconds);
        } else {
            await client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.redisClient.getClient().del(key);
    }
}
