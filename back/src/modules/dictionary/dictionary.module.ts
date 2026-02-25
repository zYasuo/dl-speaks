import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { BullModule, getQueueToken } from "@nestjs/bullmq";
import { DatabaseModule } from "../db/database.module";
import { RedisModule } from "../redis/redis.module";
import { JwtAuthModule } from "../auth/jwt/jwt.module";
import { DICTIONARY_MODULE_TOKENS } from "./constants/dictionary.tokens";
import { REDIS_MODULE_TOKENS } from "../redis/constants/redis-tokens.constants";
import { SENTENCE_QUEUE_NAME } from "./constants/dictionary.constants";
import { DictionaryController } from "./adapters/inbound/dictionary.controller";
import { WordsController } from "./adapters/inbound/words.controller";
import { SentenceProcessor } from "./adapters/inbound/sentence.processor";
import { SentenceScheduler } from "./adapters/inbound/sentence-scheduler";
import { DictionaryApiClient } from "./adapters/outbound/dictionary-api.client";
import { WordRepository } from "./adapters/outbound/word.repository";
import { TatoebaClient } from "./adapters/outbound/tatoeba.client";
import { SentenceRepository } from "./adapters/outbound/sentence.repository";
import { GetWordUseCase } from "./domain/use-cases/get-word.use-case";
import { SyncSentencesFromTatoebaUseCase } from "./domain/use-cases/sync-sentences-from-tatoeba.use-case";
import { FindWordByWordUseCase } from "./domain/use-cases/find-word-by-word.use-case";
import { CreateWordFromApiUseCase } from "./domain/use-cases/create-word-from-api.use-case";
import { GetRecentWordsUseCase } from "./domain/use-cases/get-recent-words.use-case";
import { AddToRecentWordsUseCase } from "./domain/use-cases/add-to-recent-words.use-case";
import { AddToFavoriteUseCase } from "./domain/use-cases/add-to-favorite.use-case";

@Module({
    imports: [
        ConfigModule,
        HttpModule,
        DatabaseModule,
        RedisModule,
        JwtAuthModule,
        BullModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                connection: {
                    host: config.get<string>("redis.host") ?? "localhost",
                    port: config.get<number>("redis.port") ?? 6379,
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({ name: SENTENCE_QUEUE_NAME }),
    ],
    controllers: [DictionaryController, WordsController],
    providers: [
        {
            provide: DICTIONARY_MODULE_TOKENS.CLIENT_API,
            useFactory: (config: ConfigService) =>
                config.get<string>("DICTIONARY_API_URL") ?? "",
            inject: [ConfigService],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.DICTIONARY_CLIENT,
            useClass: DictionaryApiClient,
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY,
            useClass: WordRepository,
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.FIND_WORD_BY_WORD_USE_CASE,
            useFactory: (wordRepository, cache) =>
                new FindWordByWordUseCase(wordRepository, cache),
            inject: [DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY, REDIS_MODULE_TOKENS.CACHE],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.CREATE_WORD_FROM_API_USE_CASE,
            useFactory: (wordRepository) => new CreateWordFromApiUseCase(wordRepository),
            inject: [DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.GET_RECENT_WORDS_USE_CASE,
            useFactory: (cache) => new GetRecentWordsUseCase(cache),
            inject: [REDIS_MODULE_TOKENS.CACHE],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.ADD_TO_RECENT_WORDS_USE_CASE,
            useFactory: (cache) => new AddToRecentWordsUseCase(cache),
            inject: [REDIS_MODULE_TOKENS.CACHE],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.ADD_TO_FAVORITE_USE_CASE,
            useFactory: (wordRepository) => new AddToFavoriteUseCase(wordRepository),
            inject: [DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.GET_WORD_USE_CASE,
            useFactory: (
                dictionaryClient,
                findWordByWordUseCase,
                createWordFromApiUseCase,
                addToRecentWordsUseCase
            ) =>
                new GetWordUseCase(
                    dictionaryClient,
                    findWordByWordUseCase,
                    createWordFromApiUseCase,
                    addToRecentWordsUseCase
                ),
            inject: [
                DICTIONARY_MODULE_TOKENS.DICTIONARY_CLIENT,
                DICTIONARY_MODULE_TOKENS.FIND_WORD_BY_WORD_USE_CASE,
                DICTIONARY_MODULE_TOKENS.CREATE_WORD_FROM_API_USE_CASE,
                DICTIONARY_MODULE_TOKENS.ADD_TO_RECENT_WORDS_USE_CASE,
            ],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.TATOEBA_API_URL,
            useFactory: (config: ConfigService) =>
                config.get<string>("TATOEBA_API_URL") ?? "https://api.tatoeba.org/",
            inject: [ConfigService],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.TATOEBA_CLIENT,
            useClass: TatoebaClient,
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.SENTENCE_QUEUE,
            useFactory: (queue: unknown) => queue,
            inject: [getQueueToken(SENTENCE_QUEUE_NAME)],
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.SENTENCE_REPOSITORY,
            useClass: SentenceRepository,
        },
        {
            provide: DICTIONARY_MODULE_TOKENS.SYNC_SENTENCES_FROM_TATOEBA_USE_CASE,
            useFactory: (tatoebaClient, sentenceRepository) =>
                new SyncSentencesFromTatoebaUseCase(tatoebaClient, sentenceRepository),
            inject: [
                DICTIONARY_MODULE_TOKENS.TATOEBA_CLIENT,
                DICTIONARY_MODULE_TOKENS.SENTENCE_REPOSITORY,
            ],
        },
        SentenceProcessor,
        SentenceScheduler,
    ],
    exports: [DICTIONARY_MODULE_TOKENS.GET_WORD_USE_CASE],
})
export class DictionaryModule {}
