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
        CreateUserUseCase,
        {
            provide: USER_MODULE_TOKENS.USER_REPOSITORY,
            useClass: UserRepository
        }
    ],
    exports: [CreateUserUseCase]
})
export class UserModule {}
