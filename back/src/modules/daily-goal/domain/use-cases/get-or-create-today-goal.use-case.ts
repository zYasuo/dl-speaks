import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import type { IClock } from "../ports/clock.port";
import type { TDailyGoalTodayResponse } from "@shared/schemas/daily-goal/daily-goal-today-response.schema";
import type { IUserRepository } from "src/modules/user/domain/ports/user-repository,port";
import { UserNotFoundError } from "src/commons/domain/exceptions/user.exceptions";

export class GetOrCreateTodayGoalUseCase {
    constructor(
        private readonly dailyGoalRepository: IDailyGoalRepository,
        private readonly clock: IClock,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(userUuid: string): Promise<TDailyGoalTodayResponse> {
        const user = await this.userRepository.getUserByUuid(userUuid);
        if (!user) throw new UserNotFoundError();
        const today = this.clock.getToday();
        const existing = await this.dailyGoalRepository.find(user.id, today);
        if (existing) return existing;
        return this.dailyGoalRepository.create(user.id, today);
    }
}
