import { Module } from "@nestjs/common";
import { AuthController } from "./adapters/inbound/auth.controller";
import { UserModule } from "../user/user.module";
import { JwtAuthModule } from "./jwt/jwt.module";
import { SigninUseCase } from "./domain/use-cases/signin.use-case";
import { SignupUseCase } from "./domain/use-cases/signup.use-case";
import { Argon2PasswordAdapter } from "./adapters/outbound/argon2-password.adapter";
import { JwtTokenGeneratorAdapter } from "./adapters/outbound/jwt-token-generator.adapter";
import { AUTH_MODULE_TOKENS } from "./constants/auth.tokens.constants";
import { USER_MODULE_TOKENS } from "../user/constants/user.tokens.constants";

@Module({
    imports: [UserModule, JwtAuthModule],
    controllers: [AuthController],
    providers: [
        {
            provide: AUTH_MODULE_TOKENS.SIGNIN_USE_CASE,
            useFactory: (userRepository, passwordVerifier, tokenGenerator) =>
                new SigninUseCase(userRepository, passwordVerifier, tokenGenerator),
            inject: [
                USER_MODULE_TOKENS.USER_REPOSITORY,
                AUTH_MODULE_TOKENS.PASSWORD_VERIFIER,
                AUTH_MODULE_TOKENS.TOKEN_GENERATOR,
            ],
        },
        {
            provide: AUTH_MODULE_TOKENS.SIGNUP_USE_CASE,
            useFactory: (userRepository, passwordHasher, createUserUseCase) =>
                new SignupUseCase(userRepository, passwordHasher, createUserUseCase),
            inject: [
                USER_MODULE_TOKENS.USER_REPOSITORY,
                AUTH_MODULE_TOKENS.PASSWORD_HASHER,
                USER_MODULE_TOKENS.CREATE_USER_USE_CASE,
            ],
        },
        {
            provide: AUTH_MODULE_TOKENS.PASSWORD_HASHER,
            useClass: Argon2PasswordAdapter
        },
        {
            provide: AUTH_MODULE_TOKENS.PASSWORD_VERIFIER,
            useExisting: AUTH_MODULE_TOKENS.PASSWORD_HASHER
        },
        {
            provide: AUTH_MODULE_TOKENS.TOKEN_GENERATOR,
            useClass: JwtTokenGeneratorAdapter
        }
    ]
})
export class AuthModule {}
