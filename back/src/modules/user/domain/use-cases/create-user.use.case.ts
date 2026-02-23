import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import type { TSignup } from "@shared/schemas/auth/signup.schema";
import type { IUserRepository } from "../ports/user-repository,port";
import { USER_MODULE_TOKENS } from "../../constants/user.tokens.constants";

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_MODULE_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    async execute(user: TSignup): Promise<UserEntity> {
        return this.userRepository.createUser(user);
    }
}
