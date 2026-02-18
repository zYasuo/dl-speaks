import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { DAILY_GOAL_JOB_BUILD, DAILY_GOAL_QUEUE_NAME } from "../constants/daily-goal.constants";
import { DAILY_GOAL_MODULE_TOKENS } from "../constants/daily-goal-tokens.constants";
import type { IDailyGoalService } from "../services/interfaces/daily-goal-service.interface";

@Processor(DAILY_GOAL_QUEUE_NAME)
export class DailyGoalProcessor extends WorkerHost {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_SERVICE)
        private readonly dailyGoalService: IDailyGoalService
    ) {
        super();
    }

    async process(job: Job): Promise<void> {
        if (job.name === DAILY_GOAL_JOB_BUILD) {
            await this.dailyGoalService.ensureTodayGoalsForAllUsers();
        }
    }
}
