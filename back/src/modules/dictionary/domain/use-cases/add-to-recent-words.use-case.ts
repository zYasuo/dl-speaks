import type { ICacheService } from "src/modules/redis/domain/ports/cache.port";
import {
    RECENT_WORDS_CACHE_KEY,
    RECENT_WORDS_CACHE_TTL_SECONDS,
    RECENT_WORDS_MAX_SIZE,
} from "../../constants/dictionary.constants";

export class AddToRecentWordsUseCase {
    constructor(private readonly cache: ICacheService) {}

    async execute(word: string): Promise<void> {
        const normalized = word.toLowerCase().trim();
        if (!normalized) return;

        let list: string[] = [];
        const cached = await this.cache.get(RECENT_WORDS_CACHE_KEY);
        if (cached) {
            list = JSON.parse(cached) as string[];
        }
        list = [normalized, ...list.filter((w) => w !== normalized)].slice(0, RECENT_WORDS_MAX_SIZE);
        await this.cache.set(
            RECENT_WORDS_CACHE_KEY,
            JSON.stringify(list),
            RECENT_WORDS_CACHE_TTL_SECONDS
        );
    }
}
