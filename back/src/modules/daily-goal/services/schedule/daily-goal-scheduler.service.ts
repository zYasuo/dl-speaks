import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import {
    DAILY_GOAL_CRON,
    DAILY_GOAL_JOB_BUILD,
    DAILY_GOAL_QUEUE_NAME,
} from "../../constants/daily-goal.constants";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import type { IDailyGoalQueue } from "./interfaces/daily-goal-queue.interface";

@Injectable()
export class DailyGoalSchedulerService implements OnModuleInit {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_QUEUE)
        private readonly queue: IDailyGoalQueue
    ) {}

    async onModuleInit(): Promise<void> {
        const repeatable = await this.queue.getRepeatableJobs();
        const alreadyScheduled = repeatable.some(
            (j) => j.pattern === DAILY_GOAL_CRON && j.name === DAILY_GOAL_JOB_BUILD
        );
        if (!alreadyScheduled) {
            await this.queue.add(DAILY_GOAL_JOB_BUILD, {}, {
                repeat: { pattern: DAILY_GOAL_CRON },
            });
        }
    }
}
