import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import type { IClock } from "../ports/clock.port";

export class CreateTodayGoalUseCase {
    constructor(
        private readonly dailyGoalRepository: IDailyGoalRepository,
        private readonly clock: IClock
    ) {}

    async execute(userId: number) {
        const today = this.clock.getToday();
        return this.dailyGoalRepository.create(userId, today);
    }
}
