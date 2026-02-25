import type { ICacheService } from "src/modules/redis/domain/ports/cache.port";
import { RECENT_WORDS_CACHE_KEY } from "../../constants/dictionary.constants";

export class GetRecentWordsUseCase {
    constructor(private readonly cache: ICacheService) {}

    async execute(): Promise<string[]> {
        const cached = await this.cache.get(RECENT_WORDS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached) as string[];
        }
        return [];
    }
}
