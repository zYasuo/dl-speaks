import { Test, TestingModule } from "@nestjs/testing";
import { REDIS_MODULE_TOKENS } from "../../constants/redis-tokens.constants";
import { RedisCacheAdapter } from "./redis-cache.adapter";

const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
};

const mockRedisClient = {
    getClient: jest.fn(() => mockRedis),
};

describe("RedisCacheAdapter", () => {
    let adapter: RedisCacheAdapter;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RedisCacheAdapter,
                {
                    provide: REDIS_MODULE_TOKENS.REDIS_CLIENT,
                    useValue: mockRedisClient,
                },
            ],
        }).compile();

        adapter = module.get(RedisCacheAdapter);
    });

    describe("get", () => {
        it("should call redis.get with key and return value", async () => {
            mockRedis.get.mockResolvedValue("cached-value");

            const result = await adapter.get("mykey");

            expect(mockRedisClient.getClient).toHaveBeenCalled();
            expect(mockRedis.get).toHaveBeenCalledWith("mykey");
            expect(result).toBe("cached-value");
        });

        it("should return null when key does not exist", async () => {
            mockRedis.get.mockResolvedValue(null);
            expect(await adapter.get("missing")).toBeNull();
        });
    });

    describe("set", () => {
        it("should call redis.set with key and value when no ttl", async () => {
            mockRedis.set.mockResolvedValue("OK");

            await adapter.set("k", "v");

            expect(mockRedis.set).toHaveBeenCalledWith("k", "v");
        });

        it("should call redis.set with EX and ttlSeconds when ttl provided", async () => {
            mockRedis.set.mockResolvedValue("OK");

            await adapter.set("k", "v", 3600);

            expect(mockRedis.set).toHaveBeenCalledWith("k", "v", "EX", 3600);
        });
    });

    describe("del", () => {
        it("should call redis.del with key", async () => {
            mockRedis.del.mockResolvedValue(1);

            await adapter.del("key");

            expect(mockRedis.del).toHaveBeenCalledWith("key");
        });
    });
});
