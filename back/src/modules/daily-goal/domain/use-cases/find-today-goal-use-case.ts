import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import type { IClock } from "../ports/clock.port";

export class FindTodayGoalUseCase {
    constructor(
        private readonly dailyGoalRepository: IDailyGoalRepository,
        private readonly clock: IClock
    ) {}

    async execute(userId: number) {
        const today = this.clock.getToday();
        return this.dailyGoalRepository.find(userId, today);
    }
}
