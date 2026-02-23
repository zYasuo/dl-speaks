import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "../db/database.module";
import { RedisModule } from "../redis/redis.module";
import { DictionaryApiClient } from "./client/client.api";
import { GetWordUseCase } from "./domain/use-cases/get-word.use-case";
import { DICTIONARY_MODULE_TOKENS } from "./constants/dictonary.tokens";
import { DictionaryController } from "./adapters/inbound/dictionary.controller";
import { WordsModule } from "./modules/words/words.module";

@Module({
    imports: [HttpModule, DatabaseModule, RedisModule, WordsModule],
    controllers: [DictionaryController],
    providers: [
        {
            provide: DICTIONARY_MODULE_TOKENS.CLIENT_API,
            useFactory: (config: ConfigService) =>
                config.get<string>("DICTIONARY_API_URL") ?? "",
            inject: [ConfigService],
        },
        DictionaryApiClient,
        {
            provide: DICTIONARY_MODULE_TOKENS.DICTIONARY_CLIENT,
            useExisting: DictionaryApiClient,
        },
        GetWordUseCase,
    ],
    exports: [GetWordUseCase],
})
export class DictionaryModule {}
