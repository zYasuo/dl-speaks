import { DailyGoalItem } from "./daily-goal-item.entity";

export interface IDailyGoalEntity {
    id: number;
    userId: number;
    date: Date;
    items: DailyGoalItem[];
}

export class DailyGoalEntity implements IDailyGoalEntity {
    constructor(
        public readonly id: number,
        public readonly userId: number,
        public readonly date: Date,
        public readonly items: DailyGoalItem[]
    ) {}

    static fromPrisma(prisma: {
        id: number;
        user_id: number;
        date: Date;
        items: {
            id: number;
            daily_goal_id: number;
            word_id: number;
            sort_order: number;
            completed_at: Date | null;
        }[];
    }): DailyGoalEntity {
        return new DailyGoalEntity(
            prisma.id,
            prisma.user_id,
            prisma.date,
            prisma.items.map((item) => DailyGoalItem.fromPrisma(item))
        );
    }
}
