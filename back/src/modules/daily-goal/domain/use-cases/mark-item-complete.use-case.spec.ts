import { Test, TestingModule } from "@nestjs/testing";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import { MarkItemCompleteUseCase } from "./mark-item-complete.use-case";
import { UserNotFoundError } from "src/commons/domain/exceptions/user.exceptions";

const mockDailyGoalRepository = {
    markItemComplete: jest.fn(),
};

const mockUserRepository = {
    getUserByUuid: jest.fn(),
};

describe("MarkItemCompleteUseCase", () => {
    let useCase: MarkItemCompleteUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: MarkItemCompleteUseCase,
                    useFactory: (dailyGoalRepository, userRepository) =>
                        new MarkItemCompleteUseCase(dailyGoalRepository, userRepository),
                    inject: [
                        DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY,
                        USER_MODULE_TOKENS.USER_REPOSITORY,
                    ],
                },
                {
                    provide: DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY,
                    useValue: mockDailyGoalRepository,
                },
                {
                    provide: USER_MODULE_TOKENS.USER_REPOSITORY,
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        useCase = module.get(MarkItemCompleteUseCase);
    });

    it("should mark item complete when userId is number", async () => {
        mockDailyGoalRepository.markItemComplete.mockResolvedValue(undefined);

        await useCase.execute(10, 1);

        expect(mockUserRepository.getUserByUuid).not.toHaveBeenCalled();
        expect(mockDailyGoalRepository.markItemComplete).toHaveBeenCalledWith(10, 1);
    });

    it("should resolve uuid to userId and mark item complete", async () => {
        mockUserRepository.getUserByUuid.mockResolvedValue({ id: 5, uuid: "u-1" });
        mockDailyGoalRepository.markItemComplete.mockResolvedValue(undefined);

        await useCase.execute(20, "u-1");

        expect(mockUserRepository.getUserByUuid).toHaveBeenCalledWith("u-1");
        expect(mockDailyGoalRepository.markItemComplete).toHaveBeenCalledWith(20, 5);
    });

    it("should throw UserNotFoundError when uuid does not match any user", async () => {
        mockUserRepository.getUserByUuid.mockResolvedValue(null);

        await expect(useCase.execute(10, "unknown-uuid")).rejects.toThrow(UserNotFoundError);
        await expect(useCase.execute(10, "unknown-uuid")).rejects.toThrow("User not found");
        expect(mockDailyGoalRepository.markItemComplete).not.toHaveBeenCalled();
    });
});
