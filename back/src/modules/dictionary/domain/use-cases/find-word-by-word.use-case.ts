import type { ICacheService } from "src/modules/redis/domain/ports/cache.port";
import type { IWordRepository } from "../ports/word-repository.port";
import { WordEntity } from "../entities/word.entity";

const WORD_CACHE_TTL = 60 * 60 * 24;

export class FindWordByWordUseCase {
    constructor(
        private readonly wordRepository: IWordRepository,
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
