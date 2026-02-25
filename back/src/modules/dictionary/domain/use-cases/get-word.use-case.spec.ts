import { Test, TestingModule } from "@nestjs/testing";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import { GetWordUseCase } from "./get-word.use-case";
import { WordNotFoundError } from "src/commons/domain/exceptions/word.exceptions";

const mockDictionaryApiClient = {
    getWord: jest.fn(),
};

const mockFindWordByWordUseCase = {
    execute: jest.fn(),
};

const mockCreateWordFromApiUseCase = {
    execute: jest.fn(),
};

const mockAddToRecentWordsUseCase = {
    execute: jest.fn(),
};

describe("GetWordUseCase", () => {
    let useCase: GetWordUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: GetWordUseCase,
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
                    provide: DICTIONARY_MODULE_TOKENS.DICTIONARY_CLIENT,
                    useValue: mockDictionaryApiClient,
                },
                {
                    provide: DICTIONARY_MODULE_TOKENS.FIND_WORD_BY_WORD_USE_CASE,
                    useValue: mockFindWordByWordUseCase,
                },
                {
                    provide: DICTIONARY_MODULE_TOKENS.CREATE_WORD_FROM_API_USE_CASE,
                    useValue: mockCreateWordFromApiUseCase,
                },
                {
                    provide: DICTIONARY_MODULE_TOKENS.ADD_TO_RECENT_WORDS_USE_CASE,
                    useValue: mockAddToRecentWordsUseCase,
                },
            ],
        }).compile();

        useCase = module.get(GetWordUseCase);
    });

    it("should return API data and add word to recent when entry exists and word already in DB", async () => {
        const apiData = [{ word: "hello", meanings: [] }];
        mockDictionaryApiClient.getWord.mockResolvedValue(apiData);
        mockFindWordByWordUseCase.execute.mockResolvedValue({ id: 1, word: "hello" });
        mockAddToRecentWordsUseCase.execute.mockResolvedValue(undefined);

        const result = await useCase.execute("en", "hello");

        expect(mockDictionaryApiClient.getWord).toHaveBeenCalledWith("en", "hello");
        expect(mockFindWordByWordUseCase.execute).toHaveBeenCalledWith("hello");
        expect(mockCreateWordFromApiUseCase.execute).not.toHaveBeenCalled();
        expect(mockAddToRecentWordsUseCase.execute).toHaveBeenCalledWith("hello");
        expect(result).toEqual(apiData);
    });

    it("should create word from API when entry exists but word not in DB", async () => {
        const apiData = [{ word: "world", meanings: [] }];
        mockDictionaryApiClient.getWord.mockResolvedValue(apiData);
        mockFindWordByWordUseCase.execute.mockResolvedValue(null);
        mockCreateWordFromApiUseCase.execute.mockResolvedValue({ id: 2, word: "world" });
        mockAddToRecentWordsUseCase.execute.mockResolvedValue(undefined);

        const result = await useCase.execute("en", "world");

        expect(mockFindWordByWordUseCase.execute).toHaveBeenCalledWith("world");
        expect(mockCreateWordFromApiUseCase.execute).toHaveBeenCalledWith(apiData[0]);
        expect(mockAddToRecentWordsUseCase.execute).toHaveBeenCalledWith("world");
        expect(result).toEqual(apiData);
    });

    it("should throw WordNotFoundError when API returns 404", async () => {
        const err = { response: { status: 404 } };
        mockDictionaryApiClient.getWord.mockRejectedValue(err);

        await expect(useCase.execute("en", "xyz")).rejects.toThrow(WordNotFoundError);
        await expect(useCase.execute("en", "xyz")).rejects.toThrow('Word "xyz" not found');
    });

    it("should rethrow non-404 errors", async () => {
        const err = new Error("Network error");
        mockDictionaryApiClient.getWord.mockRejectedValue(err);

        await expect(useCase.execute("en", "hello")).rejects.toThrow("Network error");
    });

    it("should not call addToRecentWords when entry is empty and word is empty after trim", async () => {
        mockDictionaryApiClient.getWord.mockResolvedValue([]);
        const result = await useCase.execute("en", "   ");

        expect(mockAddToRecentWordsUseCase.execute).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });
});
