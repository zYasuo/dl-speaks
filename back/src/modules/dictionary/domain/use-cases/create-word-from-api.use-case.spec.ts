import { Test, TestingModule } from "@nestjs/testing";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import { CreateWordFromApiUseCase } from "./create-word-from-api.use-case";
import { WordEntity } from "../entities/word.entity";

const mockWordRepository = {
    createFromApiEntry: jest.fn(),
};

describe("CreateWordFromApiUseCase", () => {
    let useCase: CreateWordFromApiUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CreateWordFromApiUseCase,
                    useFactory: (wordRepository) => new CreateWordFromApiUseCase(wordRepository),
                    inject: [DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY],
                },
                {
                    provide: DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY,
                    useValue: mockWordRepository,
                },
            ],
        }).compile();

        useCase = module.get(CreateWordFromApiUseCase);
    });

    it("should delegate to wordRepository.createFromApiEntry and return entity", async () => {
        const entry = {
            word: "hello",
            phonetic: null,
            origin: null,
            phonetics: [],
            meanings: [],
        };
        const entity = new WordEntity({
            id: 1,
            uuid: "w1",
            word: "hello",
            phonetic: null,
            origin: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            phonetics: [],
            meanings: [],
        });
        mockWordRepository.createFromApiEntry.mockResolvedValue(entity);

        const result = await useCase.execute(entry);

        expect(mockWordRepository.createFromApiEntry).toHaveBeenCalledWith(entry);
        expect(result).toBe(entity);
    });
});
