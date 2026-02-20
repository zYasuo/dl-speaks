import { Controller, Get, UseGuards, Req, Inject } from "@nestjs/common";
import type { IUserService } from "../services/interfaces/user-service.interface";
import { JwtGuard } from "src/modules/auth/jwt/guards/jwt-guard";
import { USER_MODULE_TOKENS } from "../constants/user.tokens.constants";
import { SUser, type TUser } from "@shared/schemas/user/user.schema";
import { ZodResponse } from "src/commons/decorators/zod-response.decorator";

@Controller("users")
export class UserController {
    constructor(@Inject(USER_MODULE_TOKENS.USER_SERVICE) private readonly user_service: IUserService) {}

    @Get("profile")
    @UseGuards(JwtGuard)
    @ZodResponse(SUser)
    async profile(@Req() request: Request): Promise<TUser> {
      return this.user_service.profile(request["user"].sub);
    }
}
