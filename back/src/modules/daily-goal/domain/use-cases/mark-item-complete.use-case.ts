import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import type { IUserRepository } from "src/modules/user/domain/ports/user-repository,port";
import { UserNotFoundError } from "src/commons/domain/exceptions/user.exceptions";

export class MarkItemCompleteUseCase {
    constructor(
        private readonly dailyGoalRepository: IDailyGoalRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(itemId: number, userIdOrUuid: number | string): Promise<void> {
        const userId =
            typeof userIdOrUuid === "string"
                ? (await this.userRepository.getUserByUuid(userIdOrUuid))?.id ?? null
                : userIdOrUuid;
        if (userId == null) throw new UserNotFoundError();
        await this.dailyGoalRepository.markItemComplete(itemId, userId);
    }
}
