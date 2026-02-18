import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import {
    DAILY_GOAL_CRON,
    DAILY_GOAL_JOB_BUILD,
    DAILY_GOAL_QUEUE_NAME,
} from "../constants/daily-goal.constants";

@Injectable()
export class DailyGoalSchedulerService implements OnModuleInit {
    constructor(
        @InjectQueue(DAILY_GOAL_QUEUE_NAME)
        private readonly queue: Queue
    ) {}

    async onModuleInit(): Promise<void> {
        const repeatable = await this.queue.getRepeatableJobs();
        const alreadyScheduled = repeatable.some(
            (j) => j.pattern === DAILY_GOAL_CRON && j.name === DAILY_GOAL_JOB_BUILD
        );
        if (!alreadyScheduled) {
            await this.queue.add(
                DAILY_GOAL_JOB_BUILD,
                {},
                { repeat: { pattern: DAILY_GOAL_CRON } }
            );
        }
    }
}
