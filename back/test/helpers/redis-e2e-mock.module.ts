import { Module } from "@nestjs/common";
import { REDIS_MODULE_TOKENS } from "../../src/modules/redis/constants/redis-tokens.constants";
import { RedisCacheAdapter } from "../../src/modules/redis/adapters/outbound/redis-cache.adapter";

function createInMemoryRedisClient() {
    const store = new Map<string, string>();
    return {
        get: async (key: string): Promise<string | null> => Promise.resolve(store.get(key) ?? null),
        set: async (key: string, value: string, _mode?: string, _ttl?: number): Promise<"OK" | void> => {
            store.set(key, value);
            return "OK";
        },
        del: async (key: string): Promise<number> => {
            store.delete(key);
            return 1;
        },
    };
}

const inMemoryClient = createInMemoryRedisClient();
const mockRedisClient = {
    async onModuleInit(): Promise<void> {},
    async onModuleDestroy(): Promise<void> {},
    getClient: () => inMemoryClient,
};

@Module({
    providers: [
        { provide: REDIS_MODULE_TOKENS.REDIS_CLIENT, useValue: mockRedisClient },
        { provide: REDIS_MODULE_TOKENS.CACHE, useClass: RedisCacheAdapter },
    ],
    exports: [REDIS_MODULE_TOKENS.REDIS_CLIENT, REDIS_MODULE_TOKENS.CACHE],
})
export class RedisE2eMockModule {}
