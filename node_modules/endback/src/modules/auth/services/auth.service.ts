import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type IDatabaseService } from "../../db/services/interfaces/database-config-service.interface";
import { PrismaClient, User } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "../../db/constants/db-tokens.constants";
import { AUTH_ERRORS } from "../../../commons/constants/errors/auth-errors.constants";
import * as argon2 from "argon2";
import { IAuthService } from "./interfaces/auth-services.interface";
import { USER_MODULE_TOKENS } from "../../user/constants/user.tokens.constants";
import type { IUserService } from "../../user/services/interfaces/user-service.interface";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";
import { AUTH_MODULE_TOKENS } from "../constants/auth.tokens.constants";

@Injectable()
export class AuthService implements IAuthService {
    private readonly prisma: PrismaClient;

    constructor(
        @Inject(DATABASE_MODULE_TOKENS.DATABASE_SERVICE) private readonly database: IDatabaseService,
        @Inject(USER_MODULE_TOKENS.USER_SERVICE) private readonly user_service: IUserService,
        @Inject(AUTH_MODULE_TOKENS.JWT_SERVICE) private readonly jwt_service: JwtService
    ) {
        this.prisma = this.database.getClient();
    }

    async signin(email: string, password: string) {
        let user: User;
        try {
            user = await this.user_service.getUserByEmail(email);
        } catch {
            throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
        }
        const isPasswordValid = await this.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
        }
        const payload = { sub: user.uuid, email: user.email };
        const access_token = await this.jwt_service.signAsync(payload);
        return { user, access_token };
    }
    async signup(email: string, password: string): Promise<User> {
        const exists = await this.user_service.isUserExists(email);
        if (exists) {
            throw new ConflictException(USER_ERRORS.USER_ALREADY_EXISTS);
        }
        const hashedPassword = await argon2.hash(password);
        return this.user_service.createUser({ email, password: hashedPassword });
    }

    private async verifyPassword(password: string, hashed_password: string): Promise<boolean> {
        return await argon2.verify(hashed_password, password);
    }
}
