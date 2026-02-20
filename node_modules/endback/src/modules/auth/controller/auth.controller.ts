import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
  } from "@nestjs/common";
  
  import type { IAuthService } from "../services/interfaces/auth-services.interface";
  import { AUTH_MODULE_TOKENS } from "../constants/auth.tokens.constants";
  
  import { ZodValidationPipe } from "../../../commons/pipes/zod-validation.pipe";
  import { ZodResponse } from "../../../commons/decorators/zod-response.decorator";
  
  import {
    SSignin,
    SSigninResponse,
    type TSignin,
    type TSigninResponse,
  } from "@shared/schemas/auth/signin.schema";
  
  import {
    SSignup,
    SSignupResponse,
    type TSignup,
    type TSignupResponse,
  } from "@shared/schemas/auth/signup.schema";
  
  @Controller("auth")
  export class AuthController {
    constructor(
      @Inject(AUTH_MODULE_TOKENS.AUTH_SERVICE)
      private readonly auth_service: IAuthService
    ) {}
  
    @Post("signin")
    @HttpCode(HttpStatus.OK)
    @ZodResponse(SSigninResponse)
    async signin(
      @Body(new ZodValidationPipe(SSignin)) body: TSignin
    ): Promise<TSigninResponse> {
      const { user, access_token } = await this.auth_service.signin(
        body.email,
        body.password
      );
  
      return {
        user: {
          uuid: user.uuid,
          email: user.email,
          role: user.role, 
          created_at: user.created_at,
        },
        access_token,
        token_type: "Bearer",
      };
    }
  
    @Post("signup")
    @ZodResponse(SSignupResponse)
    async signup(
      @Body(new ZodValidationPipe(SSignup)) body: TSignup
    ): Promise<TSignupResponse> {
      const user = await this.auth_service.signup(
        body.email,
        body.password
      );
  
      return {
        user: {
          uuid: user.uuid,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      };
    }
  }
  