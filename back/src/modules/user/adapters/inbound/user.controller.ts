import { Controller, Get, UseGuards, Req, Inject, Post, Body } from "@nestjs/common";
import { ZodResponse } from "src/commons/decorators/zod-response.decorator";
import { CreateUserUseCase } from "../../domain/use-cases/create-user.use.case";
import { SSignup, SSignupResponse, TSignupResponse, type TSignup } from "@shared/schemas/auth/signup.schema";
import { ZodValidationPipe } from "src/commons/pipes/zod-validation.pipe";

@Controller("users")
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase
        // private readonly getProfileUseCase: GetProfileUseCase,
    ) {}

    @Post()
    @ZodResponse(SSignupResponse)
    async signup(@Body(new ZodValidationPipe(SSignup)) body: TSignup): Promise<TSignupResponse> {
        const user = await this.createUserUseCase.execute(body);
        return {
            user: {
                uuid: user.uuid,
                email: user.email,
                role: user.role,
                created_at: user.createdAt
            }
        };
    }

    //   @Get("profile")
    //   @UseGuards(JwtGuard)
    //   @ZodResponse(SUser)
    //   async profile(@Req() request: Request): Promise<TUser> {
    //     return this.getProfileUseCase.execute(request["user"].sub);
    //   }
}
