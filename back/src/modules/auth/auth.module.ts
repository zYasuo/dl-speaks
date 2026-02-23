import { Module } from "@nestjs/common";
import { AuthController } from "./adapters/inbound/auth.controller";
import { UserModule } from "../user/user.module";
import { JwtAuthModule } from "./jwt/jwt.module";
import { SigninUseCase } from "./domain/use-cases/signin.use-case";
import { SignupUseCase } from "./domain/use-cases/signup.use-case";
import { Argon2PasswordAdapter } from "./adapters/outbound/argon2-password.adapter";
import { JwtTokenGeneratorAdapter } from "./adapters/outbound/jwt-token-generator.adapter";
import { AUTH_MODULE_TOKENS } from "./constants/auth.tokens.constants";

@Module({
    imports: [UserModule, JwtAuthModule],
    controllers: [AuthController],
    providers: [
        SigninUseCase,
        SignupUseCase,
        Argon2PasswordAdapter,
        {
            provide: AUTH_MODULE_TOKENS.PASSWORD_HASHER,
            useExisting: Argon2PasswordAdapter
        },
        {
            provide: AUTH_MODULE_TOKENS.PASSWORD_VERIFIER,
            useExisting: Argon2PasswordAdapter
        },
        JwtTokenGeneratorAdapter,
        {
            provide: AUTH_MODULE_TOKENS.TOKEN_GENERATOR,
            useClass: JwtTokenGeneratorAdapter
        }
    ]
})
export class AuthModule {}
