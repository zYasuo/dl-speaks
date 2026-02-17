import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "../db/database.module";
import { RedisModule } from "../redis/redis.module";
import { DictionaryApiClient } from "./client/client.api";
import { DictionaryService } from "./services/dictionary.service";
import { WordsService } from "./modules/words/services/words.service";
import { DICTIONARY_MODULE_TOKENS } from "./constants/dictonary.tokens";
import { DictionaryController } from "./controller/dictionary.controller";
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
        WordsService,
        {
            provide: DICTIONARY_MODULE_TOKENS.WORDS_SERVICE,
            useExisting: WordsService,
        },
        DictionaryService,
        {
            provide: DICTIONARY_MODULE_TOKENS.DICTIONARY_SERVICE,
            useClass: DictionaryService,
        },
    ],
    exports: [DICTIONARY_MODULE_TOKENS.DICTIONARY_SERVICE],
})
export class DictionaryModule {}
