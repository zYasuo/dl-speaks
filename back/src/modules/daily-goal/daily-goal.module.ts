import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "../db/database.module";
import { JwtAuthModule } from "../auth/jwt/jwt.module";
import { DAILY_GOAL_QUEUE_NAME } from "./constants/daily-goal.constants";
import { DAILY_GOAL_MODULE_TOKENS } from "./constants/daily-goal-tokens.constants";
import { DailyGoalService } from "./services/daily-goal.service";
import { DailyGoalSchedulerService } from "./services/daily-goal-scheduler.service";
import { DailyGoalProcessor } from "./processors/daily-goal.processor";
import { DailyGoalController } from "./controller/daily-goal.controller";

@Module({
    imports: [
        JwtAuthModule,
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
        DailyGoalService,
        {
            provide: DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_SERVICE,
            useClass: DailyGoalService,
        },
        DailyGoalProcessor,
        DailyGoalSchedulerService,
    ],
    exports: [DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_SERVICE],
})
export class DailyGoalModule {}
