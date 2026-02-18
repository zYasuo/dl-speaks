import { Processor, Process } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import {
    DAILY_GOAL_JOB_BUILD,
    DAILY_GOAL_QUEUE_NAME,
} from "../constants/daily-goal.constants";
import { DAILY_GOAL_MODULE_TOKENS } from "../constants/daily-goal-tokens.constants";
import type { IDailyGoalService } from "../services/interfaces/daily-goal-service.interface";

@Processor(DAILY_GOAL_QUEUE_NAME)
export class DailyGoalProcessor {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_SERVICE)
        private readonly dailyGoalService: IDailyGoalService
    ) {}

    @Process(DAILY_GOAL_JOB_BUILD)
    async handleBuildDailyGoals(job: Job): Promise<void> {
        await this.dailyGoalService.ensureTodayGoalsForAllUsers();
    }
}
