import { Module } from "@nestjs/common";
import { WordsController } from "./controller/words.controller";
import { WordsService } from "./services/words.service";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictonary.tokens";
import { DatabaseModule } from "src/modules/db/database.module";
import { RedisModule } from "src/modules/redis/redis.module";
import { JwtAuthModule } from "src/modules/auth/jwt/jwt.module";

@Module({
    imports: [DatabaseModule, RedisModule, JwtAuthModule],
    controllers: [WordsController],
    providers: [
        WordsService,
        {
            provide: DICTIONARY_MODULE_TOKENS.WORDS_SERVICE,
            useClass: WordsService
        }
    ],
    exports: [DICTIONARY_MODULE_TOKENS.WORDS_SERVICE]
})
export class WordsModule {}
