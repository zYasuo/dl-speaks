import type Redis from "ioredis";

export interface IRedisClient {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getClient(): Redis;
}
