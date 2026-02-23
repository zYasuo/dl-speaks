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
        WordRepository,
        {
            provide: WORDS_MODULE_TOKENS.WORD_REPOSITORY,
            useClass: WordRepository
        },
        FindWordByWordUseCase,
        CreateWordFromApiUseCase,
        GetRecentWordsUseCase,
        AddToRecentWordsUseCase,
        AddToFavoriteUseCase
    ],
    exports: [
        FindWordByWordUseCase,
        CreateWordFromApiUseCase,
        AddToRecentWordsUseCase
    ]
})
export class WordsModule {}
