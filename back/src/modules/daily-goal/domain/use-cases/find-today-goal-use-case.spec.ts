import { Test, TestingModule } from "@nestjs/testing";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import { FindTodayGoalUseCase } from "./find-today-goal-use-case";

const mockDailyGoalRepository = {
    find: jest.fn(),
};

const mockClock = {
    getToday: jest.fn(),
};

describe("FindTodayGoalUseCase", () => {
    let useCase: FindTodayGoalUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: FindTodayGoalUseCase,
                    useFactory: (dailyGoalRepository, clock) =>
                        new FindTodayGoalUseCase(dailyGoalRepository, clock),
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

        useCase = module.get(FindTodayGoalUseCase);
    });

    it("should call clock.getToday and repository.find with userId", async () => {
        const today = new Date("2025-02-25");
        const goal = { id: 1, date: today, items: [] };
        mockClock.getToday.mockReturnValue(today);
        mockDailyGoalRepository.find.mockResolvedValue(goal);

        const result = await useCase.execute(5);

        expect(mockClock.getToday).toHaveBeenCalledTimes(1);
        expect(mockDailyGoalRepository.find).toHaveBeenCalledWith(5, today);
        expect(result).toEqual(goal);
    });

    it("should return null when repository returns null", async () => {
        const today = new Date();
        mockClock.getToday.mockReturnValue(today);
        mockDailyGoalRepository.find.mockResolvedValue(null);

        const result = await useCase.execute(1);

        expect(result).toBeNull();
    });
});
