import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import { UserRepository } from "./user.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserAlreadyExistsError } from "src/commons/domain/exceptions/user.exceptions";

const prismaUserShape = {
    id: 1,
    uuid: "u-uuid-1",
    email: "a@b.com",
    password: "hashed",
    role: "USER",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
};

function createMockPrisma() {
    return {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    };
}

describe("UserRepository", () => {
    let repo: UserRepository;
    let mockPrisma: ReturnType<typeof createMockPrisma>;

    beforeEach(async () => {
        jest.clearAllMocks();
        mockPrisma = createMockPrisma();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                {
                    provide: DATABASE_MODULE_TOKENS.PRISMA_CLIENT,
                    useValue: mockPrisma,
                },
            ],
        }).compile();

        repo = module.get(UserRepository);
    });

    describe("createUser", () => {
        it("should create user and return entity", async () => {
            const data = { email: "new@b.com", password: "hashed" };
            mockPrisma.user.create.mockResolvedValue({ ...prismaUserShape, ...data });

            const result = await repo.createUser(data);

            expect(mockPrisma.user.create).toHaveBeenCalledWith({ data });
            expect(result).toBeInstanceOf(UserEntity);
            expect(result.email).toBe("new@b.com");
        });

        it("should throw UserAlreadyExistsError on P2002", async () => {
            mockPrisma.user.create.mockRejectedValue(
                new Prisma.PrismaClientKnownRequestError("Unique constraint", {
                    code: "P2002",
                    clientVersion: "x",
                })
            );

            await expect(repo.createUser({ email: "a@b.com", password: "x" })).rejects.toThrow(
                UserAlreadyExistsError
            );
        });
    });

    describe("getUserByEmail", () => {
        it("should return entity when found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(prismaUserShape);

            const result = await repo.getUserByEmail("a@b.com");

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "a@b.com" } });
            expect(result).toBeInstanceOf(UserEntity);
            expect(result?.email).toBe("a@b.com");
        });

        it("should return null when not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const result = await repo.getUserByEmail("unknown@b.com");

            expect(result).toBeNull();
        });
    });

    describe("getUserByUuid", () => {
        it("should return entity when found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(prismaUserShape);

            const result = await repo.getUserByUuid("u-uuid-1");

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { uuid: "u-uuid-1" } });
            expect(result).toBeInstanceOf(UserEntity);
            expect(result?.uuid).toBe("u-uuid-1");
        });

        it("should return null when not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            expect(await repo.getUserByUuid("unknown")).toBeNull();
        });
    });

    describe("isUserExists", () => {
        it("should return true when user exists", async () => {
            mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

            const result = await repo.isUserExists("a@b.com");

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: "a@b.com" },
                select: { id: true },
            });
            expect(result).toBe(true);
        });

        it("should return false when user does not exist", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            expect(await repo.isUserExists("x@b.com")).toBe(false);
        });
    });
});
