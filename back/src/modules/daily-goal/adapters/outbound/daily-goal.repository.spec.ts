import { Test, TestingModule } from "@nestjs/testing";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import { DailyGoalRepository } from "./daily-goal.repository";
import { ItemNotFoundError } from "src/commons/domain/exceptions/daily-goal.exceptions";

const today = new Date("2025-02-25");
const goalShape = { id: 1, user_id: 1, date: today, items: [] };

function createMockPrisma() {
    return {
        dailyGoal: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        user: {
            findMany: jest.fn(),
        },
        dailyGoalItem: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
        history_Word: {
            findMany: jest.fn(),
        },
        word: {
            findMany: jest.fn(),
        },
    };
}

describe("DailyGoalRepository", () => {
    let repo: DailyGoalRepository;
    let mockPrisma: ReturnType<typeof createMockPrisma>;

    beforeEach(async () => {
        jest.clearAllMocks();
        mockPrisma = createMockPrisma();
        mockPrisma.word.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);
        mockPrisma.history_Word.findMany.mockResolvedValue([]);
        mockPrisma.dailyGoalItem.findMany.mockResolvedValue([]);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DailyGoalRepository,
                {
                    provide: DATABASE_MODULE_TOKENS.PRISMA_CLIENT,
                    useValue: mockPrisma,
                },
            ],
        }).compile();

        repo = module.get(DailyGoalRepository);
    });

    describe("find", () => {
        it("should return goal when found", async () => {
            mockPrisma.dailyGoal.findUnique.mockResolvedValue(goalShape);

            const result = await repo.find(1, today);

            expect(mockPrisma.dailyGoal.findUnique).toHaveBeenCalledWith({
                where: { user_id_date: { user_id: 1, date: today } },
                include: expect.any(Object),
            });
            expect(result).toEqual(goalShape);
        });

        it("should return null when not found", async () => {
            mockPrisma.dailyGoal.findUnique.mockResolvedValue(null);
            expect(await repo.find(1, today)).toBeNull();
        });
    });

    describe("create", () => {
        it("should create goal with items from pickWordIdsForUser", async () => {
            mockPrisma.dailyGoal.create.mockResolvedValue(goalShape);

            const result = await repo.create(1, today);

            expect(mockPrisma.dailyGoal.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    user_id: 1,
                    date: today,
                    items: expect.objectContaining({ create: expect.any(Array) }),
                }),
                include: expect.any(Object),
            });
            expect(result).toEqual(goalShape);
        });
    });

    describe("getUsersWithoutGoalForDate", () => {
        it("should return user ids that have no goal for date", async () => {
            mockPrisma.user.findMany.mockResolvedValue([
                { id: 1, daily_goals: [{ id: 1 }] },
                { id: 2, daily_goals: [] },
                { id: 3, daily_goals: [] },
            ]);

            const result = await repo.getUsersWithoutGoalForDate(today);

            expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
                select: expect.objectContaining({
                    id: true,
                    daily_goals: expect.any(Object),
                }),
            });
            expect(result).toEqual([2, 3]);
        });

        it("should return empty array when all users have goal", async () => {
            mockPrisma.user.findMany.mockResolvedValue([
                { id: 1, daily_goals: [{}] },
                { id: 2, daily_goals: [{}] },
            ]);
            expect(await repo.getUsersWithoutGoalForDate(today)).toEqual([]);
        });
    });

    describe("markItemComplete", () => {
        it("should update item when found", async () => {
            mockPrisma.dailyGoalItem.findFirst.mockResolvedValue({ id: 10 });
            mockPrisma.dailyGoalItem.update.mockResolvedValue({});

            await repo.markItemComplete(10, 1);

            expect(mockPrisma.dailyGoalItem.findFirst).toHaveBeenCalledWith({
                where: { id: 10, daily_goal: { user_id: 1 } },
                select: { id: true },
            });
            expect(mockPrisma.dailyGoalItem.update).toHaveBeenCalledWith({
                where: { id: 10 },
                data: expect.objectContaining({ completed_at: expect.any(Date) }),
            });
        });

        it("should throw ItemNotFoundError when item not found", async () => {
            mockPrisma.dailyGoalItem.findFirst.mockResolvedValue(null);

            await expect(repo.markItemComplete(999, 1)).rejects.toThrow(ItemNotFoundError);
            expect(mockPrisma.dailyGoalItem.update).not.toHaveBeenCalled();
        });
    });
});
