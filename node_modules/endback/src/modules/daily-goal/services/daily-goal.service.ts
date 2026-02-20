import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import type { IDatabaseService } from "src/modules/db/services/interfaces/database-config-service.interface";
import { DAYS_TO_EXCLUDE_RECENT, ITEMS_PER_DAY } from "../constants/daily-goal.constants";
import type { IDailyGoalService } from "./interfaces/daily-goal-service.interface";
import type { TDailyGoalTodayResponse } from "@shared/schemas/daily-goal/daily-goal-today-response.schema";
import type { TItemIdParam } from "@shared/schemas/daily-goal/item-id.param";

@Injectable()
export class DailyGoalService implements IDailyGoalService {
    private readonly prisma: PrismaClient;

    constructor(
        @Inject(DATABASE_MODULE_TOKENS.DATABASE_SERVICE)
        private readonly database: IDatabaseService
    ) {
        this.prisma = this.database.getClient();
    }

    async getOrCreateTodayGoalByUserUuid(userUuid: string): Promise<TDailyGoalTodayResponse> {
        const today = this.todayDate();
        const user = await this.prisma.user.findUnique({
            where: { uuid: userUuid },
            select: {
                id: true,
                daily_goals: {
                    where: { date: today },
                    take: 1,
                    orderBy: { id: "desc" },
                    include: {
                        items: {
                            orderBy: { sort_order: "asc" },
                            include: { word: true }
                        }
                    }
                }
            }
        });
        if (!user) throw new NotFoundException("Usuário não encontrado.");
        const existing = user.daily_goals[0];
        if (existing) return existing;
        return this.createTodayGoalForUser(user.id);
    }

    async getOrCreateTodayGoal(userId: number): Promise<TDailyGoalTodayResponse> {
        const today = this.todayDate();
        let goal = await this.prisma.dailyGoal.findUnique({
            where: { user_id_date: { user_id: userId, date: today } },
            include: {
                items: {
                    orderBy: { sort_order: "asc" },
                    include: { word: true }
                }
            }
        });
        if (goal) return goal;

        return this.createTodayGoalForUser(userId);
    }

    private async createTodayGoalForUser(
        userId: number
    ): Promise<TDailyGoalTodayResponse> {
        const today = this.todayDate();
        const wordIds = await this.pickWordIdsForUser(userId, ITEMS_PER_DAY);
        return this.prisma.dailyGoal.create({
            data: {
                user_id: userId,
                date: today,
                items: {
                    create: wordIds.map((wordId, i) => ({
                        word_id: wordId,
                        sort_order: i
                    }))
                }
            },
            include: {
                items: {
                    orderBy: { sort_order: "asc" },
                    include: { word: true }
                }
            }
        });
    }

    async markItemComplete(itemId: TItemIdParam, userIdOrUuid: number | string): Promise<void> {
        const userId =
            typeof userIdOrUuid === "string"
                ? await this.prisma.user
                      .findUnique({
                          where: { uuid: userIdOrUuid },
                          select: { id: true }
                      })
                      .then((u) => u?.id)
                : userIdOrUuid;
        if (userId == null) {
            throw new NotFoundException("Usuário não encontrado.");
        }
        const item = await this.prisma.dailyGoalItem.findFirst({
            where: {
                id: itemId,
                daily_goal: { user_id: userId }
            },
            select: { id: true }
        });
        if (!item) {
            throw new NotFoundException("Item da meta não encontrado.");
        }
        await this.prisma.dailyGoalItem.update({
            where: { id: itemId },
            data: { completed_at: new Date() }
        });
    }

    async ensureTodayGoalsForAllUsers(): Promise<void> {
        const today = this.todayDate();
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                daily_goals: {
                    where: { date: today },
                    select: { id: true },
                    take: 1
                }
            }
        });
        const missingUserIds = users
            .filter((u) => u.daily_goals.length === 0)
            .map((u) => u.id);
        await Promise.all(
            missingUserIds.map((userId) => this.createTodayGoalForUser(userId))
        );
    }

    private todayDate(): Date {
        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        return d;
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

        const excluded = new Set([
            ...historyRows.map((r) => r.word_id),
            ...recentRows.map((r) => r.word_id)
        ]);
        const allWords = await this.prisma.word.findMany({
            select: { id: true }
        });
        const available = allWords.map((w) => w.id).filter((id) => !excluded.has(id));
        const shuffled = available.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
}
