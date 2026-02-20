import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { USER_MODULE_TOKENS } from "./constants/user.tokens.constants";
import { DatabaseModule } from "../db/database.module";
import { UserController } from "./controller/user.controller";
import { JwtAuthModule } from "../auth/jwt/jwt.module";

@Module({
    imports: [DatabaseModule, JwtAuthModule],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: USER_MODULE_TOKENS.USER_SERVICE,
            useClass: UserService
        }
    ],
    exports: [USER_MODULE_TOKENS.USER_SERVICE],
})
export class UserModule {}