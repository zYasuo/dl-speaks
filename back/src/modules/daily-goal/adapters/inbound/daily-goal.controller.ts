import {
    Controller,
    Get,
    Patch,
    Param,
    UseGuards,
    Req,
    Inject,
} from "@nestjs/common";
import { JwtGuard } from "src/modules/auth/jwt/guards/jwt-guard";
import { ZodValidationPipe } from "src/commons/pipes/zod-validation.pipe";
import { ZodResponse } from "src/commons/decorators/zod-response.decorator";
import { DAILY_GOAL_MODULE_TOKENS } from "../../constants/daily-goal-tokens.constants";
import { SItemIdParam, type TItemIdParam } from "@shared/schemas/daily-goal/item-id.param";
import {
    SDailyGoalTodayResponse,
    type TDailyGoalTodayResponse,
} from "@shared/schemas/daily-goal/daily-goal-today-response.schema";
import {
    SMarkCompleteResponse,
    type TMarkCompleteResponse,
} from "@shared/schemas/daily-goal/mark-complete-response.schema";
import { GetOrCreateTodayGoalUseCase } from "../../domain/use-cases/get-or-create-today-goal.use-case";
import { MarkItemCompleteUseCase } from "../../domain/use-cases/mark-item-complete.use-case";

@Controller("daily-goals")
@UseGuards(JwtGuard)
export class DailyGoalController {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.GET_OR_CREATE_TODAY_GOAL_USE_CASE)
        private readonly getOrCreateTodayGoal: GetOrCreateTodayGoalUseCase,
        @Inject(DAILY_GOAL_MODULE_TOKENS.MARK_ITEM_COMPLETE_USE_CASE)
        private readonly markItemComplete: MarkItemCompleteUseCase
    ) {}

    @Get("today")
    @ZodResponse(SDailyGoalTodayResponse)
    async getToday(
        @Req() req: { user: { sub: string } }
    ): Promise<TDailyGoalTodayResponse> {
        return this.getOrCreateTodayGoal.execute(req.user.sub);
    }

    @Patch("items/:id/complete")
    @ZodResponse(SMarkCompleteResponse)
    async markComplete(
        @Param("id", new ZodValidationPipe(SItemIdParam)) itemId: TItemIdParam,
        @Req() req: { user: { sub: string } }
    ): Promise<TMarkCompleteResponse> {
        await this.markItemComplete.execute(itemId, req.user.sub);
        return { ok: true };
    }
}
