import { Module } from "@nestjs/common";
import { BullModule, getQueueToken } from "@nestjs/bullmq";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "../db/database.module";
import { JwtAuthModule } from "../auth/jwt/jwt.module";
import { UserModule } from "../user/user.module";
import { DAILY_GOAL_QUEUE_NAME } from "./constants/daily-goal.constants";
import { DAILY_GOAL_MODULE_TOKENS } from "./constants/daily-goal-tokens.constants";
import { DailyGoalController } from "./adapters/inbound/daily-goal.controller";
import { DailyGoalSchedulerService } from "./adapters/inbound/daily-goal-scheduler.service";
import { DailyGoalProcessor } from "./adapters/inbound/daily-goal.processor";
import { DailyGoalRepository } from "./adapters/outbound/daily-goal.repository";
import { ClockAdapter } from "./adapters/outbound/clock.adapter";
import { GetOrCreateTodayGoalUseCase } from "./domain/use-cases/get-or-create-today-goal.use-case";
import { MarkItemCompleteUseCase } from "./domain/use-cases/mark-item-complete.use-case";
import { EnsureTodayGoalsForAllUsersUseCase } from "./domain/use-cases/ensure-today-goals-for-all-users.use-case";

@Module({
    imports: [
        JwtAuthModule,
        UserModule,
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                connection: {
                    host: config.get<string>("redis.host") ?? "localhost",
                    port: config.get<number>("redis.port") ?? 6379,
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({ name: DAILY_GOAL_QUEUE_NAME }),
        DatabaseModule,
    ],
    controllers: [DailyGoalController],
    providers: [
        {
            provide: DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_QUEUE,
            useFactory: (queue: unknown) => queue,
            inject: [getQueueToken(DAILY_GOAL_QUEUE_NAME)],
        },
        {
            provide: DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_REPOSITORY,
            useClass: DailyGoalRepository,
        },
        {
            provide: DAILY_GOAL_MODULE_TOKENS.CLOCK,
            useClass: ClockAdapter,
        },
        {
            provide: DAILY_GOAL_MODULE_TOKENS.GET_OR_CREATE_TODAY_GOAL_USE_CASE,
            useClass: GetOrCreateTodayGoalUseCase,
        },
        {
            provide: DAILY_GOAL_MODULE_TOKENS.MARK_ITEM_COMPLETE_USE_CASE,
            useClass: MarkItemCompleteUseCase,
        },
        {
            provide: DAILY_GOAL_MODULE_TOKENS.ENSURE_TODAY_GOALS_FOR_ALL_USERS_USE_CASE,
            useClass: EnsureTodayGoalsForAllUsersUseCase,
        },
        DailyGoalProcessor,
        DailyGoalSchedulerService,
    ],
})
export class DailyGoalModule {}
