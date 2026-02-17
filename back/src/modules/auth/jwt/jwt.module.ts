import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtGuard } from "./guards/jwt-guard";
import { AUTH_MODULE_TOKENS } from "../constants/auth.tokens.constants";
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? "ENDBACK_SECRET",
            signOptions: { expiresIn: Number(process.env.JWT_EXPIRES_IN) || 18_000 }
        })
    ],
    providers: [
        JwtGuard,
        {
            provide: AUTH_MODULE_TOKENS.JWT_SERVICE,
            useExisting: JwtService
        }
    ],
    exports: [JwtModule, JwtGuard, AUTH_MODULE_TOKENS.JWT_SERVICE]
})
export class JwtAuthModule {}
