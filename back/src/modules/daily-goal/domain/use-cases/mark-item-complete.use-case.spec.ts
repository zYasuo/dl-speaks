import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import { MarkItemCompleteUseCase } from "./mark-item-complete.use-case";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";

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
                MarkItemCompleteUseCase,
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

    it("should throw NotFoundException when uuid does not match any user", async () => {
        mockUserRepository.getUserByUuid.mockResolvedValue(null);

        await expect(useCase.execute(10, "unknown-uuid")).rejects.toThrow(NotFoundException);
        await expect(useCase.execute(10, "unknown-uuid")).rejects.toThrow(USER_ERRORS.USER_NOT_FOUND);
        expect(mockDailyGoalRepository.markItemComplete).not.toHaveBeenCalled();
    });
});
