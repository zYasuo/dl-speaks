import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import type { IDailyGoalRepository } from "../../domain/ports/daily-goal-repository.port";
import type { TDailyGoalTodayResponse } from "@shared/schemas/daily-goal/daily-goal-today-response.schema";
import { ITEMS_PER_DAY, DAYS_TO_EXCLUDE_RECENT } from "../../constants/daily-goal.constants";
import { PrismaClient } from "@prisma/client";
import { ItemNotFoundError } from "src/commons/domain/exceptions/daily-goal.exceptions";

const dailyGoalInclude = {
    items: {
        orderBy: { sort_order: "asc" as const },
        include: { word: true }
    }
} as const;

@Injectable()
export class DailyGoalRepository implements IDailyGoalRepository {
    constructor(
        @Inject(DATABASE_MODULE_TOKENS.PRISMA_CLIENT)
        private readonly prisma: PrismaClient
    ) {}

    async find(userId: number, date: Date): Promise<TDailyGoalTodayResponse | null> {
        const goal = await this.prisma.dailyGoal.findUnique({
            where: { user_id_date: { user_id: userId, date } },
            include: dailyGoalInclude
        });
        return goal as TDailyGoalTodayResponse | null;
    }

    async create(userId: number, date: Date): Promise<TDailyGoalTodayResponse> {
        const wordIds = await this.pickWordIdsForUser(userId, ITEMS_PER_DAY);
        const created = await this.prisma.dailyGoal.create({
            data: {
                user_id: userId,
                date,
                items: {
                    create: wordIds.map((wordId, i) => ({
                        word_id: wordId,
                        sort_order: i
                    }))
                }
            },
            include: dailyGoalInclude
        });
        return created as TDailyGoalTodayResponse;
    }

    async getUsersWithoutGoalForDate(date: Date): Promise<number[]> {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                daily_goals: {
                    where: { date },
                    select: { id: true },
                    take: 1
                }
            }
        });
        return users.filter((u) => u.daily_goals.length === 0).map((u) => u.id);
    }

    async markItemComplete(itemId: number, userId: number): Promise<void> {
        const item = await this.prisma.dailyGoalItem.findFirst({
            where: {
                id: itemId,
                daily_goal: { user_id: userId }
            },
            select: { id: true }
        });
        if (!item) throw new ItemNotFoundError();
        await this.prisma.dailyGoalItem.update({
            where: { id: itemId },
            data: { completed_at: new Date() }
        });
    }

    private async pickWordIdsForUser(userId: number, count: number): Promise<number[]> {
        const since = new Date();
        since.setUTCDate(since.getUTCDate() - DAYS_TO_EXCLUDE_RECENT);
        since.setUTCHours(0, 0, 0, 0);

        const [historyRows, recentRows] = await Promise.all([
            this.prisma.history_Word.findMany({
                where: { user_id: userId },
                select: { word_id: true }
            }),
            this.prisma.dailyGoalItem.findMany({
                where: {
                    daily_goal: {
                        user_id: userId,
                        date: { gte: since }
                    }
                },
                select: { word_id: true }
            })
        ]);

        const excluded = new Set([...historyRows.map((r) => r.word_id), ...recentRows.map((r) => r.word_id)]);
        const allWords = await this.prisma.word.findMany({
            select: { id: true }
        });
        const available = allWords.map((w) => w.id).filter((id) => !excluded.has(id));
        const shuffled = available.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
}
