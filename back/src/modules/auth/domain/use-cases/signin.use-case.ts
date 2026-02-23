import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AUTH_ERRORS } from "src/commons/constants/errors/auth-errors.constants";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import type { IUserRepository } from "src/modules/user/domain/ports/user-repository,port";
import type { IPasswordVerifier } from "../ports/password-verifier.port";
import type { ITokenGenerator } from "../ports/token-generator.port";
import { AUTH_MODULE_TOKENS } from "../../constants/auth.tokens.constants";

export interface SigninResult {
    user: { uuid: string; email: string; role: "USER" | "ADMIN"; created_at: Date };
    access_token: string;
}

@Injectable()
export class SigninUseCase {
    constructor(
        @Inject(USER_MODULE_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(AUTH_MODULE_TOKENS.PASSWORD_VERIFIER)
        private readonly passwordVerifier: IPasswordVerifier,
        @Inject(AUTH_MODULE_TOKENS.TOKEN_GENERATOR)
        private readonly tokenGenerator: ITokenGenerator
    ) {}

    async execute(email: string, password: string): Promise<SigninResult> {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
        }

        const isValid = await this.passwordVerifier.verify(password, user.password);
        if (!isValid) {
            throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
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
