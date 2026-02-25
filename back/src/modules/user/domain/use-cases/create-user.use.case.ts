import { UserEntity } from "../entities/user.entity";
import type { TSignup } from "@shared/schemas/auth/signup.schema";
import type { IUserRepository } from "../ports/user-repository,port";

export class CreateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(user: TSignup): Promise<UserEntity> {
        return this.userRepository.createUser(user);
    }
}
