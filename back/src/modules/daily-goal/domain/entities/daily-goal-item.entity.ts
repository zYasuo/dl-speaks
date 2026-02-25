export interface IDailyGoalItem {
    id: number;
    dailyGoalId: number;
    wordId: number;
    sortOrder: number;
    completedAt: Date | null;
}

export class DailyGoalItem implements IDailyGoalItem {
    constructor(
        public readonly id: number,
        public readonly dailyGoalId: number,
        public readonly wordId: number,
        public readonly sortOrder: number,
        public readonly completedAt: Date | null
    ) {}

    static fromPrisma(prisma: {
        id: number;
        daily_goal_id: number;
        word_id: number;
        sort_order: number;
        completed_at: Date | null;
    }): DailyGoalItem {
        return new DailyGoalItem(
            prisma.id,
            prisma.daily_goal_id,
            prisma.word_id,
            prisma.sort_order,
            prisma.completed_at
        );
    }
}
