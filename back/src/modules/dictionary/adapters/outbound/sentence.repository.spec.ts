import { Test, TestingModule } from "@nestjs/testing";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import { SentenceRepository } from "./sentence.repository";

describe("SentenceRepository", () => {
    let repo: SentenceRepository;
    const mockPrisma = {
        sentence: {
            createMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SentenceRepository,
                {
                    provide: DATABASE_MODULE_TOKENS.PRISMA_CLIENT,
                    useValue: mockPrisma,
                },
            ],
        }).compile();

        repo = module.get(SentenceRepository);
    });

    it("should return 0 when sentences array is empty", async () => {
        const result = await repo.upsertMany([]);

        expect(result).toBe(0);
        expect(mockPrisma.sentence.createMany).not.toHaveBeenCalled();
    });

    it("should map sentences to prisma shape and return count", async () => {
        mockPrisma.sentence.createMany.mockResolvedValue({ count: 3 });
        const sentences = [
            { externalId: 1, text: "Hello.", lang: "eng" },
            { externalId: 2, text: "Bye.", lang: "eng" },
            { externalId: 3, text: "Hi.", lang: "eng" },
        ];

        const result = await repo.upsertMany(sentences);

        expect(mockPrisma.sentence.createMany).toHaveBeenCalledWith({
            data: [
                { external_id: 1, text: "Hello.", lang: "eng" },
                { external_id: 2, text: "Bye.", lang: "eng" },
                { external_id: 3, text: "Hi.", lang: "eng" },
            ],
            skipDuplicates: true,
        });
        expect(result).toBe(3);
    });

    it("should return actual count when skipDuplicates reduces inserted rows", async () => {
        mockPrisma.sentence.createMany.mockResolvedValue({ count: 1 });

        const result = await repo.upsertMany([
            { externalId: 10, text: "One.", lang: "eng" },
            { externalId: 20, text: "Two.", lang: "eng" },
        ]);

        expect(result).toBe(1);
    });
});
