import { Inject, Injectable } from "@nestjs/common";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import type { IClock } from "../ports/clock.port";

@Injectable()
export class EnsureTodayGoalsForAllUsersUseCase {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY)
        private readonly dailyGoalRepository: IDailyGoalRepository,
        @Inject(DAILY_GOAL_MODULE_TOKENS.CLOCK)
        private readonly clock: IClock
    ) {}

    async execute(): Promise<void> {
        const today = this.clock.getToday();
        const missingUserIds = await this.dailyGoalRepository.getUsersWithoutGoalForDate(today);
        await Promise.all(
            missingUserIds.map((userId) => this.dailyGoalRepository.create(userId, today))
        );
    }
}
