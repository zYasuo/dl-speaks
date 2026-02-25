import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "../../src/modules/db/database.module";
import { RedisModule } from "../../src/modules/redis/redis.module";
import { DictionaryModule } from "../../src/modules/dictionary/dictionary.module";
import { RedisE2eMockModule } from "./redis-e2e-mock.module";
import redisConfig from "../../src/config/redis/redis.config";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
        HttpModule,
        DatabaseModule,
        RedisModule,
        DictionaryModule,
    ],
})
export class DictionaryE2eModule {}
