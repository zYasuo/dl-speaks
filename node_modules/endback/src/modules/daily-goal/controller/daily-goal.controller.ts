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
import { DAILY_GOAL_MODULE_TOKENS } from "../constants/daily-goal-tokens.constants";
import type { IDailyGoalService } from "../services/interfaces/daily-goal-service.interface";
import { SItemIdParam, type TItemIdParam } from "@shared/schemas/daily-goal/item-id.param";
import {
    SDailyGoalTodayResponse,
    type TDailyGoalTodayResponse,
} from "@shared/schemas/daily-goal/daily-goal-today-response.schema";
import {
    SMarkCompleteResponse,
    type TMarkCompleteResponse,
} from "@shared/schemas/daily-goal/mark-complete-response.schema";

@Controller("daily-goals")
@UseGuards(JwtGuard)
export class DailyGoalController {
    constructor(
        @Inject(DAILY_GOAL_MODULE_TOKENS.DAILY_GOAL_SERVICE)
        private readonly dailyGoalService: IDailyGoalService
    ) {}

    @Get("today")
    @ZodResponse(SDailyGoalTodayResponse)
    async getToday(
        @Req() req: { user: { sub: string } }
    ): Promise<TDailyGoalTodayResponse> {
        return this.dailyGoalService.getOrCreateTodayGoalByUserUuid(req.user.sub);
    }

    @Patch("items/:id/complete")
    @ZodResponse(SMarkCompleteResponse)
    async markComplete(
        @Param("id", new ZodValidationPipe(SItemIdParam)) itemId: TItemIdParam,
        @Req() req: { user: { sub: string } }
    ): Promise<TMarkCompleteResponse> {
        await this.dailyGoalService.markItemComplete(itemId, req.user.sub);
        return { ok: true };
    }
}
