import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import type { IDailyGoalRepository } from "../ports/daily-goal-repository.port";
import type { IClock } from "../ports/clock.port";
import type { TDailyGoalTodayResponse } from "@shared/schemas/daily-goal/daily-goal-today-response.schema";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import type { IUserRepository } from "src/modules/user/domain/ports/user-repository,port";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";

@Injectable()
export class GetOrCreateTodayGoalUseCase {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY)
        private readonly dailyGoalRepository: IDailyGoalRepository,
        @Inject(DAILY_GOAL_MODULE_TOKENS.CLOCK)
        private readonly clock: IClock,
        @Inject(USER_MODULE_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    async execute(userUuid: string): Promise<TDailyGoalTodayResponse> {
        const user = await this.userRepository.getUserByUuid(userUuid);
        if (!user) throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        const today = this.clock.getToday();
        const existing = await this.dailyGoalRepository.find(user.id, today);
        if (existing) return existing;
        return this.dailyGoalRepository.create(user.id, today);
    }
}
