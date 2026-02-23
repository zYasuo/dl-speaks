import { Module } from "@nestjs/common";
import { WordsController } from "./adapters/inbound/words.controller";
import { DatabaseModule } from "src/modules/db/database.module";
import { RedisModule } from "src/modules/redis/redis.module";
import { JwtAuthModule } from "src/modules/auth/jwt/jwt.module";
import { WordRepository } from "./adapters/outbound/word.repository";
import { FindWordByWordUseCase } from "./domain/use-cases/find-word-by-word.use-case";
import { CreateWordFromApiUseCase } from "./domain/use-cases/create-word-from-api.use-case";
import { GetRecentWordsUseCase } from "./domain/use-cases/get-recent-words.use-case";
import { AddToRecentWordsUseCase } from "./domain/use-cases/add-to-recent-words.use-case";
import { AddToFavoriteUseCase } from "./domain/use-cases/add-to-favorite.use-case";
import { WORDS_MODULE_TOKENS } from "./constants/words-tokens.constants";

@Module({
    imports: [DatabaseModule, RedisModule, JwtAuthModule],
    controllers: [WordsController],
    providers: [
        {
            provide: WORDS_MODULE_TOKENS.WORD_REPOSITORY,
            useClass: WordRepository
        },
        {
            provide: WORDS_MODULE_TOKENS.FIND_WORD_BY_WORD_USE_CASE,
            useClass: FindWordByWordUseCase
        },
        {
            provide: WORDS_MODULE_TOKENS.CREATE_WORD_FROM_API_USE_CASE,
            useClass: CreateWordFromApiUseCase
        },
        {
            provide: WORDS_MODULE_TOKENS.GET_RECENT_WORDS_USE_CASE,
            useClass: GetRecentWordsUseCase
        },
        {
            provide: WORDS_MODULE_TOKENS.ADD_TO_RECENT_WORDS_USE_CASE,
            useClass: AddToRecentWordsUseCase
        },
        {
            provide: WORDS_MODULE_TOKENS.ADD_TO_FAVORITE_USE_CASE,
            useClass: AddToFavoriteUseCase
        }
    ],
    exports: [
        WORDS_MODULE_TOKENS.FIND_WORD_BY_WORD_USE_CASE,
        WORDS_MODULE_TOKENS.CREATE_WORD_FROM_API_USE_CASE,
        WORDS_MODULE_TOKENS.ADD_TO_RECENT_WORDS_USE_CASE
    ]
})
export class WordsModule {}
