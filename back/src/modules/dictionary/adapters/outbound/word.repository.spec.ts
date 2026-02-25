import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import { WordRepository } from "./word.repository";
import { WordEntity } from "../../domain/entities/word.entity";
import { WordAlreadyInFavoriteError } from "src/commons/domain/exceptions/word.exceptions";

const prismaWordShape = {
    id: 1,
    uuid: "w-uuid-1",
    word: "hello",
    phonetic: null,
    origin: null,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
    phonetics: [],
    meanings: [],
};

function createMockPrisma() {
    return {
        word: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        favorite_Word: {
            create: jest.fn(),
        },
    };
}

describe("WordRepository", () => {
    let repo: WordRepository;
    let mockPrisma: ReturnType<typeof createMockPrisma>;

    beforeEach(async () => {
        jest.clearAllMocks();
        mockPrisma = createMockPrisma();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WordRepository,
                {
                    provide: DATABASE_MODULE_TOKENS.PRISMA_CLIENT,
                    useValue: mockPrisma,
                },
            ],
        }).compile();

        repo = module.get(WordRepository);
    });

    describe("findByWord", () => {
        it("should normalize word (lowercase, trim) and return entity when found", async () => {
            mockPrisma.word.findFirst.mockResolvedValue(prismaWordShape);

            const result = await repo.findByWord("  Hello  ");

            expect(mockPrisma.word.findFirst).toHaveBeenCalledWith({
                where: { word: "hello" },
                include: expect.any(Object),
            });
            expect(result).toBeInstanceOf(WordEntity);
            expect(result?.word).toBe("hello");
        });

        it("should return null when word not found", async () => {
            mockPrisma.word.findFirst.mockResolvedValue(null);

            const result = await repo.findByWord("unknown");

            expect(result).toBeNull();
        });
    });

    describe("createFromApiEntry", () => {
        const minimalEntry = {
            word: "world",
            phonetic: null,
            origin: null,
            phonetics: [],
            meanings: [],
        };

        it("should create word and return entity", async () => {
            mockPrisma.word.create.mockResolvedValue({ ...prismaWordShape, word: "world" });

            const result = await repo.createFromApiEntry(minimalEntry);

            expect(mockPrisma.word.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    word: "world",
                    phonetic: null,
                    origin: null,
                }),
                include: expect.any(Object),
            });
            expect(result).toBeInstanceOf(WordEntity);
        });

        it("should return existing entity when P2002 (unique) and word already exists", async () => {
            const existing = { ...prismaWordShape, word: "world" };
            mockPrisma.word.create.mockRejectedValue(
                new Prisma.PrismaClientKnownRequestError("Unique constraint", {
                    code: "P2002",
                    clientVersion: "x",
                })
            );
            mockPrisma.word.findFirst.mockResolvedValue(existing);

            const result = await repo.createFromApiEntry(minimalEntry);

            expect(mockPrisma.word.findFirst).toHaveBeenCalledWith({
                where: { word: "world" },
                include: expect.any(Object),
            });
            expect(result).toBeInstanceOf(WordEntity);
            expect(result.word).toBe("world");
        });

        it("should rethrow when P2002 but findByWord returns null", async () => {
            const prismaError = new Prisma.PrismaClientKnownRequestError("Unique constraint", {
                code: "P2002",
                clientVersion: "x",
            });
            mockPrisma.word.create.mockRejectedValue(prismaError);
            mockPrisma.word.findFirst.mockResolvedValue(null);

            await expect(repo.createFromApiEntry({ ...minimalEntry, word: "x" })).rejects.toThrow(
                Prisma.PrismaClientKnownRequestError
            );
        });
    });

    describe("addToFavorite", () => {
        it("should call favorite_Word.create with wordId and userId", async () => {
            mockPrisma.favorite_Word.create.mockResolvedValue(undefined);

            await repo.addToFavorite({ wordId: 10, userId: 20 });

            expect(mockPrisma.favorite_Word.create).toHaveBeenCalledWith({
                data: { word_id: 10, user_id: 20 },
            });
        });

        it("should throw WordAlreadyInFavoriteError when P2002 (duplicate)", async () => {
            mockPrisma.favorite_Word.create.mockRejectedValue(
                new Prisma.PrismaClientKnownRequestError("Unique constraint", {
                    code: "P2002",
                    clientVersion: "x",
                })
            );

            await expect(repo.addToFavorite({ wordId: 1, userId: 2 })).rejects.toThrow(
                WordAlreadyInFavoriteError
            );
        });

        it("should rethrow non-P2002 errors", async () => {
            const err = new Error("DB connection lost");
            mockPrisma.favorite_Word.create.mockRejectedValue(err);

            await expect(repo.addToFavorite({ wordId: 1, userId: 2 })).rejects.toThrow(
                "DB connection lost"
            );
        });
    });
});
