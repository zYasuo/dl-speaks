/// <reference types="jest" />
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { DictionaryE2eModule } from "../helpers/dictionary-e2e.module";
import { RedisModule } from "../../src/modules/redis/redis.module";
import { RedisE2eMockModule } from "../helpers/redis-e2e-mock.module";
import { GlobalHttpExceptionFilter } from "../../src/commons/filters/http-exception.filter";
import { DICTIONARY_MODULE_TOKENS } from "../../src/modules/dictionary/constants/dictonary.tokens";
import { mockDictionaryClient } from "../helpers/dictionary-api-mock";

describe("Dictionary (e2e)", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [DictionaryE2eModule],
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

    describe("GET /api/v1/dictionary/:language/:word", () => {
        it("should return word entry from mock", async () => {
            const res = await request(app.getHttpServer())
                .get("/api/v1/dictionary/en/hello")
                .expect(200);

            const data = Array.isArray(res.body) ? res.body[0] : res.body;
            expect(data).toHaveProperty("word", "hello");
            expect(data).toHaveProperty("meanings");
            expect(Array.isArray(data.meanings)).toBe(true);
            expect(data.meanings[0]).toHaveProperty("partOfSpeech", "noun");
        });
    });
});
