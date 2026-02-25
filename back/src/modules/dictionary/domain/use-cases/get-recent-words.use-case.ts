import { Inject, Injectable } from "@nestjs/common";
import { REDIS_MODULE_TOKENS } from "src/modules/redis/constants/redis-tokens.constants";
import type { ICacheService } from "src/modules/redis/domain/ports/cache.port";
import { RECENT_WORDS_CACHE_KEY } from "../../constants/dictionary.constants";

@Injectable()
export class GetRecentWordsUseCase {
    constructor(
        @Inject(REDIS_MODULE_TOKENS.CACHE)
        private readonly cache: ICacheService
    ) {}

    async execute(): Promise<string[]> {
        const cached = await this.cache.get(RECENT_WORDS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached) as string[];
        }
        return [];
    }
}
