import { Test, TestingModule } from "@nestjs/testing";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import { SyncSentencesFromTatoebaUseCase } from "./sync-sentences-from-tatoeba.use-case";

const mockTatoebaClient = {
    searchSentences: jest.fn(),
};

const mockSentenceRepository = {
    upsertMany: jest.fn(),
};

describe("SyncSentencesFromTatoebaUseCase", () => {
    let useCase: SyncSentencesFromTatoebaUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SyncSentencesFromTatoebaUseCase,
                {
                    provide: DICTIONARY_MODULE_TOKENS.TATOEBA_CLIENT,
                    useValue: mockTatoebaClient,
                },
                {
                    provide: DICTIONARY_MODULE_TOKENS.SENTENCE_REPOSITORY,
                    useValue: mockSentenceRepository,
                },
            ],
        }).compile();

        useCase = module.get(SyncSentencesFromTatoebaUseCase);
    });

    it("should fetch sentences from Tatoeba and save via repository", async () => {
        const sentences = [
            { id: 1, text: "Hello world.", lang: "eng" },
            { id: 2, text: "Good morning.", lang: "eng" },
        ];
        mockTatoebaClient.searchSentences.mockResolvedValue(sentences);
        mockSentenceRepository.upsertMany.mockResolvedValue(2);

        const result = await useCase.execute();

        expect(mockTatoebaClient.searchSentences).toHaveBeenCalledTimes(1);
        expect(mockTatoebaClient.searchSentences).toHaveBeenCalledWith(
            expect.objectContaining({
                from: "eng",
                page: [0, 50],
                options: 0x1,
            })
        );
        expect(mockSentenceRepository.upsertMany).toHaveBeenCalledWith([
            { externalId: 1, text: "Hello world.", lang: "eng" },
            { externalId: 2, text: "Good morning.", lang: "eng" },
        ]);
        expect(result).toEqual({ fetched: 2, saved: 2 });
    });

    it("should return saved count from repository", async () => {
        mockTatoebaClient.searchSentences.mockResolvedValue([
            { id: 10, text: "Only one.", lang: "eng" },
        ]);
        mockSentenceRepository.upsertMany.mockResolvedValue(0);

        const result = await useCase.execute();

        expect(result.fetched).toBe(1);
        expect(result.saved).toBe(0);
    });
});
