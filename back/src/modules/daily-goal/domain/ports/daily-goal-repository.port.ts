import type { TDailyGoalTodayResponse } from "@shared/schemas/daily-goal/daily-goal-today-response.schema";

export interface IDailyGoalRepository {
    find(userId: number, date: Date): Promise<TDailyGoalTodayResponse | null>;
    create(userId: number, date: Date): Promise<TDailyGoalTodayResponse>;
    getUsersWithoutGoalForDate(date: Date): Promise<number[]>;
    markItemComplete(itemId: number, userId: number): Promise<void>;
}
