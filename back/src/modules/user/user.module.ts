import { Module } from "@nestjs/common";
import { USER_MODULE_TOKENS } from "./constants/user.tokens.constants";
import { DatabaseModule } from "../db/database.module";
import { JwtAuthModule } from "../auth/jwt/jwt.module";
import { UserController } from "./adapters/inbound/user.controller";
import { CreateUserUseCase } from "./domain/use-cases/create-user.use.case";
import { UserRepository } from "./adapters/outbound/user.repository";

@Module({
    imports: [DatabaseModule, JwtAuthModule],
    controllers: [UserController],
    providers: [
        {
            provide: USER_MODULE_TOKENS.CREATE_USER_USE_CASE,
            useClass: CreateUserUseCase
        },
        {
            provide: USER_MODULE_TOKENS.USER_REPOSITORY,
            useClass: UserRepository
        }
    ],
    exports: [USER_MODULE_TOKENS.CREATE_USER_USE_CASE, USER_MODULE_TOKENS.USER_REPOSITORY]
})
export class UserModule {}
