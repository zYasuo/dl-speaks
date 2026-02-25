import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import { GetOrCreateTodayGoalUseCase } from "./get-or-create-today-goal.use-case";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";

const mockDailyGoalRepository = {
    find: jest.fn(),
    create: jest.fn(),
};

const mockClock = {
    getToday: jest.fn(),
};

const mockUserRepository = {
    getUserByUuid: jest.fn(),
};

describe("GetOrCreateTodayGoalUseCase", () => {
    let useCase: GetOrCreateTodayGoalUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetOrCreateTodayGoalUseCase,
                {
                    provide: DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY,
                    useValue: mockDailyGoalRepository,
                },
                {
                    provide: DAILY_GOAL_MODULE_TOKENS.CLOCK,
                    useValue: mockClock,
                },
                {
                    provide: USER_MODULE_TOKENS.USER_REPOSITORY,
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        useCase = module.get(GetOrCreateTodayGoalUseCase);
    });

    it("should throw NotFoundException when user not found", async () => {
        mockUserRepository.getUserByUuid.mockResolvedValue(null);

        await expect(useCase.execute("unknown-uuid")).rejects.toThrow(NotFoundException);
        await expect(useCase.execute("unknown-uuid")).rejects.toThrow(USER_ERRORS.USER_NOT_FOUND);
        expect(mockDailyGoalRepository.find).not.toHaveBeenCalled();
    });

    it("should return existing goal when found", async () => {
        const user = { id: 1, uuid: "u1" };
        const today = new Date("2025-02-25");
        const existing = { id: 10, date: today, items: [] };
        mockUserRepository.getUserByUuid.mockResolvedValue(user);
        mockClock.getToday.mockReturnValue(today);
        mockDailyGoalRepository.find.mockResolvedValue(existing);

        const result = await useCase.execute("u1");

        expect(mockDailyGoalRepository.find).toHaveBeenCalledWith(1, today);
        expect(mockDailyGoalRepository.create).not.toHaveBeenCalled();
        expect(result).toEqual(existing);
    });

    it("should create and return goal when not found", async () => {
        const user = { id: 2, uuid: "u2" };
        const today = new Date("2025-02-25");
        const created = { id: 20, date: today, items: [] };
        mockUserRepository.getUserByUuid.mockResolvedValue(user);
        mockClock.getToday.mockReturnValue(today);
        mockDailyGoalRepository.find.mockResolvedValue(null);
        mockDailyGoalRepository.create.mockResolvedValue(created);

        const result = await useCase.execute("u2");

        expect(mockDailyGoalRepository.create).toHaveBeenCalledWith(2, today);
        expect(result).toEqual(created);
    });
});
