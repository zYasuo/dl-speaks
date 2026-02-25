import { Inject, Injectable } from "@nestjs/common";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import type { IClock } from "../ports/clock.port";

@Injectable()
export class CreateTodayGoalUseCase {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY)
        private readonly dailyGoalRepository: IDailyGoalRepository,
        @Inject(DAILY_GOAL_MODULE_TOKENS.CLOCK)
        private readonly clock: IClock
    ) {}

    async execute(userId: number) {
        const today = this.clock.getToday();
        return this.dailyGoalRepository.create(userId, today);
    }
}
