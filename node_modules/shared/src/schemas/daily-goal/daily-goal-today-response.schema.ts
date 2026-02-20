import { z } from "zod";

const SWord = z.object({
    id: z.number(),
    uuid: z.string(),
    word: z.string(),
    phonetic: z.string().nullable(),
    origin: z.string().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
});

const SDailyGoalItem = z.object({
    id: z.number(),
    daily_goal_id: z.number(),
    word_id: z.number(),
    sort_order: z.number(),
    completed_at: z.date().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
    word: SWord,
});

export const SDailyGoalTodayResponse = z.object({
    id: z.number(),
    user_id: z.number(),
    date: z.date(),
    created_at: z.date(),
    updated_at: z.date(),
    items: z.array(SDailyGoalItem),
});

export type TDailyGoalTodayResponse = z.infer<typeof SDailyGoalTodayResponse>;
