import { Test, TestingModule } from "@nestjs/testing";
import { REDIS_MODULE_TOKENS } from "src/modules/redis/constants/redis-tokens.constants";
import {
    RECENT_WORDS_CACHE_KEY,
    RECENT_WORDS_MAX_SIZE,
} from "../../constants/dictionary.constants";
import { AddToRecentWordsUseCase } from "./add-to-recent-words.use-case";

const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
};

describe("AddToRecentWordsUseCase", () => {
    let useCase: AddToRecentWordsUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AddToRecentWordsUseCase,
                {
                    provide: REDIS_MODULE_TOKENS.CACHE,
                    useValue: mockCache,
                },
            ],
        }).compile();

        useCase = module.get(AddToRecentWordsUseCase);
    });

    it("should add word to empty list", async () => {
        mockCache.get.mockResolvedValue(null);
        mockCache.set.mockResolvedValue(undefined);

        await useCase.execute("hello");

        expect(mockCache.set).toHaveBeenCalledWith(
            RECENT_WORDS_CACHE_KEY,
            JSON.stringify(["hello"]),
            expect.any(Number)
        );
    });

    it("should prepend word and dedupe existing list", async () => {
        mockCache.get.mockResolvedValue(JSON.stringify(["world", "foo"]));
        mockCache.set.mockResolvedValue(undefined);

        await useCase.execute("world");

        expect(mockCache.set).toHaveBeenCalledWith(
            RECENT_WORDS_CACHE_KEY,
            JSON.stringify(["world", "foo"]),
            expect.any(Number)
        );
    });

    it("should normalize word (trim and lowercase)", async () => {
        mockCache.get.mockResolvedValue(null);

        await useCase.execute("  HELLO  ");

        expect(mockCache.set).toHaveBeenCalledWith(
            RECENT_WORDS_CACHE_KEY,
            JSON.stringify(["hello"]),
            expect.any(Number)
        );
    });

    it("should not call set when word is empty after normalize", async () => {
        await useCase.execute("   ");

        expect(mockCache.get).not.toHaveBeenCalled();
        expect(mockCache.set).not.toHaveBeenCalled();
    });

    it("should cap list at RECENT_WORDS_MAX_SIZE", async () => {
        const existing = Array.from({ length: RECENT_WORDS_MAX_SIZE }, (_, i) => `w${i}`);
        mockCache.get.mockResolvedValue(JSON.stringify(existing));

        await useCase.execute("new");

        const list = JSON.parse(mockCache.set.mock.calls[0][1]) as string[];
        expect(list).toHaveLength(RECENT_WORDS_MAX_SIZE);
        expect(list[0]).toBe("new");
    });
});
