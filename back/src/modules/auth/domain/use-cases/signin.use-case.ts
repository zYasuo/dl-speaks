import type { IUserRepository } from "src/modules/user/domain/ports/user-repository,port";
import type { IPasswordVerifier } from "../ports/password-verifier.port";
import type { ITokenGenerator } from "../ports/token-generator.port";
import { InvalidCredentialsError } from "src/commons/domain/exceptions/auth.exceptions";

export interface SigninResult {
    user: { uuid: string; email: string; role: "USER" | "ADMIN"; created_at: Date };
    access_token: string;
}

export class SigninUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordVerifier: IPasswordVerifier,
        private readonly tokenGenerator: ITokenGenerator
    ) {}

    async execute(email: string, password: string): Promise<SigninResult> {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const isValid = await this.passwordVerifier.verify(password, user.password);
        if (!isValid) {
            throw new InvalidCredentialsError();
        }

        const access_token = await this.tokenGenerator.sign({
            sub: user.uuid,
            email: user.email
        });

        return {
            user: {
                uuid: user.uuid,
                email: user.email,
                role: user.role as "USER" | "ADMIN",
                created_at: user.createdAt
            },
            access_token
        };
    }
}
