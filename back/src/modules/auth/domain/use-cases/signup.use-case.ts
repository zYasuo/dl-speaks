import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import type { IUserRepository } from "src/modules/user/domain/ports/user-repository,port";
import type { IPasswordHasher } from "../ports/password-hasher.port";
import { CreateUserUseCase } from "src/modules/user/domain/use-cases/create-user.use.case";
import { AUTH_MODULE_TOKENS } from "../../constants/auth.tokens.constants";

@Injectable()
export class SignupUseCase {
    constructor(
        @Inject(USER_MODULE_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(AUTH_MODULE_TOKENS.PASSWORD_HASHER)
        private readonly passwordHasher: IPasswordHasher,
        private readonly createUserUseCase: CreateUserUseCase
    ) {}

    async execute(email: string, password: string) {
        const exists = await this.userRepository.isUserExists(email);
        if (exists) {
            throw new ConflictException(USER_ERRORS.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await this.passwordHasher.hash(password);
        return this.createUserUseCase.execute({ email, password: hashedPassword });
    }
}
