import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import type { IRedisClient } from "./interfaces/redis-client.interface";
import { REDIS_ERRORS_CONSTANTS } from "src/commons/constants/errors/redis-errors.constants";
export type { Redis } from "ioredis";

@Injectable()
export class RedisClient implements IRedisClient {
    private client: Redis | null = null;

    constructor(private readonly config: ConfigService) {}

    async onModuleInit(): Promise<void> {
        const host = this.config.get<string>("redis.host") ?? "localhost";
        const port = this.config.get<number>("redis.port") ?? 6379;
        this.client = new Redis({ host, port });
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client) {
            this.client.disconnect();
            this.client = null;
        }
    }

    getClient(): Redis {
        if (!this.client) {
            throw new Error(REDIS_ERRORS_CONSTANTS.REDIS_CLIENT_NOT_INITIALIZED);
        }
        return this.client;
    }
}
