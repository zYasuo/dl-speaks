import { Test, TestingModule } from "@nestjs/testing";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import { EnsureTodayGoalsForAllUsersUseCase } from "./ensure-today-goals-for-all-users.use-case";

const mockDailyGoalRepository = {
    getUsersWithoutGoalForDate: jest.fn(),
    create: jest.fn(),
};

const mockClock = {
    getToday: jest.fn(),
};

describe("EnsureTodayGoalsForAllUsersUseCase", () => {
    let useCase: EnsureTodayGoalsForAllUsersUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: EnsureTodayGoalsForAllUsersUseCase,
                    useFactory: (dailyGoalRepository, clock) =>
                        new EnsureTodayGoalsForAllUsersUseCase(dailyGoalRepository, clock),
                    inject: [DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY, DAILY_GOAL_MODULE_TOKENS.CLOCK],
                },
                {
                    provide: DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY,
                    useValue: mockDailyGoalRepository,
                },
                {
                    provide: DAILY_GOAL_MODULE_TOKENS.CLOCK,
                    useValue: mockClock,
                },
            ],
        }).compile();

        useCase = module.get(EnsureTodayGoalsForAllUsersUseCase);
    });

    it("should get today from clock and fetch users without goal", async () => {
        const today = new Date("2025-02-25");
        mockClock.getToday.mockReturnValue(today);
        mockDailyGoalRepository.getUsersWithoutGoalForDate.mockResolvedValue([]);

        await useCase.execute();

        expect(mockClock.getToday).toHaveBeenCalledTimes(1);
        expect(mockDailyGoalRepository.getUsersWithoutGoalForDate).toHaveBeenCalledWith(today);
    });

    it("should create goal for each user without goal", async () => {
        const today = new Date("2025-02-25");
        mockClock.getToday.mockReturnValue(today);
        mockDailyGoalRepository.getUsersWithoutGoalForDate.mockResolvedValue([1, 3, 5]);
        mockDailyGoalRepository.create.mockResolvedValue({ id: 1, date: today, items: [] });

        await useCase.execute();

        expect(mockDailyGoalRepository.create).toHaveBeenCalledTimes(3);
        expect(mockDailyGoalRepository.create).toHaveBeenNthCalledWith(1, 1, today);
        expect(mockDailyGoalRepository.create).toHaveBeenNthCalledWith(2, 3, today);
        expect(mockDailyGoalRepository.create).toHaveBeenNthCalledWith(3, 5, today);
    });

    it("should do nothing when all users have goal", async () => {
        mockClock.getToday.mockReturnValue(new Date());
        mockDailyGoalRepository.getUsersWithoutGoalForDate.mockResolvedValue([]);

        await useCase.execute();

        expect(mockDailyGoalRepository.create).not.toHaveBeenCalled();
    });
});
