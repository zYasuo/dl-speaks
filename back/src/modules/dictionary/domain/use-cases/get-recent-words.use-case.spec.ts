import { Test, TestingModule } from "@nestjs/testing";
import { REDIS_MODULE_TOKENS } from "src/modules/redis/constants/redis-tokens.constants";
import { RECENT_WORDS_CACHE_KEY } from "../../constants/dictionary.constants";
import { GetRecentWordsUseCase } from "./get-recent-words.use-case";

const mockCache = {
    get: jest.fn(),
};

describe("GetRecentWordsUseCase", () => {
    let useCase: GetRecentWordsUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetRecentWordsUseCase,
                {
                    provide: REDIS_MODULE_TOKENS.CACHE,
                    useValue: mockCache,
                },
            ],
        }).compile();

        useCase = module.get(GetRecentWordsUseCase);
    });

    it("should return parsed list from cache", async () => {
        const list = ["hello", "world"];
        mockCache.get.mockResolvedValue(JSON.stringify(list));

        const result = await useCase.execute();

        expect(mockCache.get).toHaveBeenCalledWith(RECENT_WORDS_CACHE_KEY);
        expect(result).toEqual(list);
    });

    it("should return empty array when cache is empty", async () => {
        mockCache.get.mockResolvedValue(null);

        const result = await useCase.execute();

        expect(result).toEqual([]);
    });
});
