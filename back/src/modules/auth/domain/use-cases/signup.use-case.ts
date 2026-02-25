import type { IUserRepository } from "src/modules/user/domain/ports/user-repository,port";
import type { IPasswordHasher } from "../ports/password-hasher.port";
import type { CreateUserUseCase } from "src/modules/user/domain/use-cases/create-user.use.case";
import { UserAlreadyExistsError } from "src/commons/domain/exceptions/user.exceptions";

export class SignupUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly createUserUseCase: CreateUserUseCase
    ) {}

    async execute(email: string, password: string) {
        const exists = await this.userRepository.isUserExists(email);
        if (exists) {
            throw new UserAlreadyExistsError();
        }

        const hashedPassword = await this.passwordHasher.hash(password);
        return this.createUserUseCase.execute({ email, password: hashedPassword });
    }
}
