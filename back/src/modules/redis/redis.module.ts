import { Module } from "@nestjs/common";
import { REDIS_MODULE_TOKENS } from "./constants/redis-tokens.constants";
import { RedisClient } from "./client/redis.client";
import { CacheService } from "./services/cache.service";

@Module({
    providers: [
        {
            provide: REDIS_MODULE_TOKENS.REDIS_CLIENT,
            useClass: RedisClient,
        },
        {
            provide: REDIS_MODULE_TOKENS.CACHE,
            useClass: CacheService,
        },
    ],
    exports: [REDIS_MODULE_TOKENS.REDIS_CLIENT, REDIS_MODULE_TOKENS.CACHE],
})
export class RedisModule {}
