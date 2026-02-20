import type { TDailyGoalTodayResponse } from "@shared/schemas/daily-goal/daily-goal-today-response.schema";
import type { TItemIdParam } from "@shared/schemas/daily-goal/item-id.param";

export interface IDailyGoalService {
    getOrCreateTodayGoalByUserUuid(
        userUuid: string
    ): Promise<TDailyGoalTodayResponse>;
    getOrCreateTodayGoal(userId: number): Promise<TDailyGoalTodayResponse>;
    markItemComplete(
        itemId: TItemIdParam,
        userIdOrUuid: number | string
    ): Promise<void>;
    ensureTodayGoalsForAllUsers(): Promise<void>;
}
