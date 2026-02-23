import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { SSignin, SSigninResponse, type TSignin, type TSigninResponse } from "@shared/schemas/auth/signin.schema";

import { SSignup, SSignupResponse, type TSignup, type TSignupResponse } from "@shared/schemas/auth/signup.schema";

import { SigninUseCase } from "../../domain/use-cases/signin.use-case";
import { SignupUseCase } from "../../domain/use-cases/signup.use-case";
import { ZodValidationPipe } from "src/commons/pipes/zod-validation.pipe";
import { ZodResponse } from "src/commons/decorators/zod-response.decorator";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly signinUseCase: SigninUseCase,
        private readonly signupUseCase: SignupUseCase
    ) {}

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    @ZodResponse(SSigninResponse)
    async signin(@Body(new ZodValidationPipe(SSignin)) body: TSignin): Promise<TSigninResponse> {
        const { user, access_token } = await this.signinUseCase.execute(body.email, body.password);

        return {
            user,
            access_token,
            token_type: "Bearer"
        };
    }

    @Post("signup")
    @ZodResponse(SSignupResponse)
    async signup(@Body(new ZodValidationPipe(SSignup)) body: TSignup): Promise<TSignupResponse> {
        const userEntity = await this.signupUseCase.execute(body.email, body.password);

        return {
            user: {
                uuid: userEntity.uuid,
                email: userEntity.email,
                role: userEntity.role,
                created_at: userEntity.createdAt
            }
        };
    }
}
