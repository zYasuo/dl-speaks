import { Module } from "@nestjs/common";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./services/auth.service";
import { DatabaseModule } from "../db/database.module";
import { AUTH_MODULE_TOKENS } from "./constants/auth.tokens.constants";
import { UserModule } from "../user/user.module";
import { JwtAuthModule } from "./jwt/jwt.module";

@Module({
    imports: [DatabaseModule, UserModule, JwtAuthModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: AUTH_MODULE_TOKENS.AUTH_SERVICE,
            useClass: AuthService
        }
    ]
})
export class AuthModule {}
