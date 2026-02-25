import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { DAILY_GOAL_JOB_BUILD, DAILY_GOAL_QUEUE_NAME } from "../../constants/daily-goal.constants";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import { EnsureTodayGoalsForAllUsersUseCase } from "../../domain/use-cases/ensure-today-goals-for-all-users.use-case";

@Processor(DAILY_GOAL_QUEUE_NAME)
export class DailyGoalProcessor extends WorkerHost {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.ENSURE_TODAY_GOALS_FOR_ALL_USERS_USE_CASE)
        private readonly ensureTodayGoals: EnsureTodayGoalsForAllUsersUseCase
    ) {
        super();
    }

    async process(job: Job): Promise<void> {
        if (job.name === DAILY_GOAL_JOB_BUILD) {
            await this.ensureTodayGoals.execute();
        }
    }
}
