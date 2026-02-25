/// <reference types="jest" />
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "../../src/modules/db/database.module";
import { RedisModule } from "../../src/modules/redis/redis.module";
import { AuthModule } from "../../src/modules/auth/auth.module";
import { DictionaryModule } from "../../src/modules/dictionary/dictionary.module";
import { RedisE2eMockModule } from "../helpers/redis-e2e-mock.module";
import { GlobalHttpExceptionFilter } from "../../src/commons/filters/http-exception.filter";
import { DICTIONARY_MODULE_TOKENS } from "../../src/modules/dictionary/constants/dictonary.tokens";
import { mockDictionaryClient } from "../helpers/dictionary-api-mock";
import redisConfig from "../../src/config/redis/redis.config";

describe("Words (e2e)", () => {
    let app: INestApplication;

    const validPassword = "password123";

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
                HttpModule,
                DatabaseModule,
                RedisModule,
                AuthModule,
                DictionaryModule,
            ],
        })
            .overrideModule(RedisModule)
            .useModule(RedisE2eMockModule)
            .overrideProvider(DICTIONARY_MODULE_TOKENS.DICTIONARY_CLIENT)
            .useValue(mockDictionaryClient)
            .compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("api/v1");
        app.useGlobalFilters(new GlobalHttpExceptionFilter());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("GET /api/v1/words/recent", () => {
        it("should return recent words (empty or list)", async () => {
            const res = await request(app.getHttpServer())
                .get("/api/v1/words/recent")
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe("POST /api/v1/words/favorite", () => {
        it("should return 401 without token", async () => {
            await request(app.getHttpServer())
                .post("/api/v1/words/favorite")
                .send({ wordId: 1 })
                .expect(401);
        });
    });
});
