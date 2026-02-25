import { Test, TestingModule } from "@nestjs/testing";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import { AddToFavoriteUseCase } from "./add-to-favorite.use-case";

const mockWordRepository = {
    addToFavorite: jest.fn(),
};

describe("AddToFavoriteUseCase", () => {
    let useCase: AddToFavoriteUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AddToFavoriteUseCase,
                    useFactory: (wordRepository) => new AddToFavoriteUseCase(wordRepository),
                    inject: [DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY],
                },
                {
                    provide: DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY,
                    useValue: mockWordRepository,
                },
            ],
        }).compile();

        useCase = module.get(AddToFavoriteUseCase);
    });

    it("should delegate to wordRepository.addToFavorite", async () => {
        const data = { wordId: 1, userId: 2 };
        mockWordRepository.addToFavorite.mockResolvedValue(undefined);

        await useCase.execute(data);

        expect(mockWordRepository.addToFavorite).toHaveBeenCalledWith(data);
    });
});
