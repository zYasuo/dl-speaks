import { Module } from "@nestjs/common";
import { REDIS_MODULE_TOKENS } from "./constants/redis-tokens.constants";
import { RedisClient } from "./client/redis.client";
import { RedisCacheAdapter } from "./adapters/outbound/redis-cache.adapter";

@Module({
    providers: [
        {
            provide: REDIS_MODULE_TOKENS.REDIS_CLIENT,
            useClass: RedisClient
        },
        {
            provide: REDIS_MODULE_TOKENS.CACHE,
            useClass: RedisCacheAdapter
        }
    ],
    exports: [REDIS_MODULE_TOKENS.REDIS_CLIENT, REDIS_MODULE_TOKENS.CACHE],
})
export class RedisModule {}
