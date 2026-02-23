import { Inject, Injectable } from "@nestjs/common";
import { REDIS_MODULE_TOKENS } from "src/modules/redis/constants/redis-tokens.constants";
import type { ICacheService } from "src/modules/redis/domain/ports/cache.port";
import type { IWordRepository } from "../ports/word-repository.port";
import { WordEntity } from "../entities/word.entity";
import { WORDS_MODULE_TOKENS } from "../../constants/words-tokens.constants";

const WORD_CACHE_TTL = 60 * 60 * 24; // 24h

@Injectable()
export class FindWordByWordUseCase {
    constructor(
        @Inject(WORDS_MODULE_TOKENS.WORD_REPOSITORY)
        private readonly wordRepository: IWordRepository,
        @Inject(REDIS_MODULE_TOKENS.CACHE)
        private readonly cache: ICacheService
    ) {}

    async execute(word: string): Promise<WordEntity | null> {
        const normalized = word.toLowerCase().trim();
        const cacheKey = `word:${normalized}`;

        const cached = await this.cache.get(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached) as Parameters<typeof WordEntity.fromCached>[0];
            return WordEntity.fromCached(parsed);
        }

        const result = await this.wordRepository.findByWord(normalized);
        if (result) {
            await this.cache.set(cacheKey, JSON.stringify(result.toPrismaShape()), WORD_CACHE_TTL);
        }
        return result;
    }
}
