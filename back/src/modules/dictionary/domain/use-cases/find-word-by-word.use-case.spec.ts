import { Test, TestingModule } from "@nestjs/testing";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import { REDIS_MODULE_TOKENS } from "src/modules/redis/constants/redis-tokens.constants";
import { FindWordByWordUseCase } from "./find-word-by-word.use-case";
import { WordEntity } from "../entities/word.entity";

const mockWordRepository = {
    findByWord: jest.fn(),
};

const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
};

describe("FindWordByWordUseCase", () => {
    let useCase: FindWordByWordUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FindWordByWordUseCase,
                {
                    provide: DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY,
                    useValue: mockWordRepository,
                },
                {
                    provide: REDIS_MODULE_TOKENS.CACHE,
                    useValue: mockCache,
                },
            ],
        }).compile();

        useCase = module.get(FindWordByWordUseCase);
    });

    it("should return word from cache when present", async () => {
        const cachedShape = {
            id: 1,
            uuid: "w1",
            word: "hello",
            phonetic: null,
            origin: null,
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
            phonetics: [],
            meanings: [],
        };
        mockCache.get.mockResolvedValue(JSON.stringify(cachedShape));

        const result = await useCase.execute("  Hello  ");

        expect(mockCache.get).toHaveBeenCalledWith("word:hello");
        expect(mockWordRepository.findByWord).not.toHaveBeenCalled();
        expect(result).toBeInstanceOf(WordEntity);
        expect(result?.word).toBe("hello");
    });

    it("should fetch from repository and set cache when not in cache", async () => {
        mockCache.get.mockResolvedValue(null);
        const entity = new WordEntity({
            id: 1,
            uuid: "w1",
            word: "world",
            phonetic: null,
            origin: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            phonetics: [],
            meanings: [],
        });
        mockWordRepository.findByWord.mockResolvedValue(entity);

        const result = await useCase.execute("world");

        expect(mockWordRepository.findByWord).toHaveBeenCalledWith("world");
        expect(mockCache.set).toHaveBeenCalledWith(
            "word:world",
            expect.any(String),
            60 * 60 * 24
        );
        expect(result).toEqual(entity);
    });

    it("should return null when not in cache and repository returns null", async () => {
        mockCache.get.mockResolvedValue(null);
        mockWordRepository.findByWord.mockResolvedValue(null);

        const result = await useCase.execute("unknown");

        expect(mockCache.set).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });
});
