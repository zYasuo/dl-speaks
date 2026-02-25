import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import type { IClock } from "../ports/clock.port";

export class EnsureTodayGoalsForAllUsersUseCase {
    constructor(
        private readonly dailyGoalRepository: IDailyGoalRepository,
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
