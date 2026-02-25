import { Test, TestingModule } from "@nestjs/testing";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import { CreateTodayGoalUseCase } from "./create-today-goal.use-case";

const mockDailyGoalRepository = {
    create: jest.fn(),
};

const mockClock = {
    getToday: jest.fn(),
};

describe("CreateTodayGoalUseCase", () => {
    let useCase: CreateTodayGoalUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CreateTodayGoalUseCase,
                    useFactory: (dailyGoalRepository, clock) =>
                        new CreateTodayGoalUseCase(dailyGoalRepository, clock),
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

        useCase = module.get(CreateTodayGoalUseCase);
    });

    it("should call clock.getToday and repository.create with userId", async () => {
        const today = new Date("2025-02-25");
        const created = { id: 1, date: today, items: [] };
        mockClock.getToday.mockReturnValue(today);
        mockDailyGoalRepository.create.mockResolvedValue(created);

        const result = await useCase.execute(3);

        expect(mockClock.getToday).toHaveBeenCalledTimes(1);
        expect(mockDailyGoalRepository.create).toHaveBeenCalledWith(3, today);
        expect(result).toEqual(created);
    });
});
