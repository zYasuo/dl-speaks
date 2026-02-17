import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../../db/database.module";
import { AuthModule } from "../../auth/auth.module";
import { DictionaryModule } from "../../dictionary/dictionary.module";
import { RedisModule } from "../../redis/redis.module";
import redisConfig from "../../../config/redis/redis.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [redisConfig],
        }),
        DatabaseModule,
        RedisModule,
        AuthModule,
        DictionaryModule,
    ],
    controllers: [],
    providers: [],
    exports: [DatabaseModule, AuthModule],
})
export class ApiV1Module {}