export type RepeatableJobItem = {
    key: string;
    name: string;
    pattern: string | null;
};

export interface IDailyGoalQueue {
    getRepeatableJobs(): Promise<RepeatableJobItem[]>;
    add(
        name: string,
        data: object,
        opts?: { repeat?: { pattern: string } }
    ): Promise<unknown>;
}
