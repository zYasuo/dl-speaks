import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import type { IUserRepository } from "src/modules/user/domain/ports/user-repository,port";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";

@Injectable()
export class MarkItemCompleteUseCase {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY)
        private readonly dailyGoalRepository: IDailyGoalRepository,
        @Inject(USER_MODULE_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    async execute(itemId: number, userIdOrUuid: number | string): Promise<void> {
        const userId =
            typeof userIdOrUuid === "string"
                ? (await this.userRepository.getUserByUuid(userIdOrUuid))?.id ?? null
                : userIdOrUuid;
        if (userId == null) throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        await this.dailyGoalRepository.markItemComplete(itemId, userId);
    }
}
