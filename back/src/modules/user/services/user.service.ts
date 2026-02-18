import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "../../db/constants/db-tokens.constants";
import type { IDatabaseService } from "src/modules/db/services/interfaces/database-config-service.interface";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";
import { IUserService } from "./interfaces/user-service.interface";
import type { TSignup } from "@shared/schemas/auth/signup.schema";
import type { TUser, TUserUpdate } from "@shared/schemas/user/user.schema";

@Injectable()
export class UserService implements IUserService {
    private readonly prisma: PrismaClient;

    constructor(
        @Inject(DATABASE_MODULE_TOKENS.DATABASE_SERVICE)
        private readonly database: IDatabaseService
    ) {
        this.prisma = this.database.getClient();
    }

    async createUser(user: TSignup): Promise<User> {
        try {
            return await this.prisma.user.create({ data: user });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new BadRequestException(USER_ERRORS.USER_ALREADY_EXISTS);
            }
            throw e;
        }
    }

    async deleteUser(uuid: string): Promise<void> {
        try {
            await this.prisma.user.delete({ where: { uuid } });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
                throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
            }
            throw e;
        }
    }

    async updateUser(uuid: string, data: TUserUpdate): Promise<User> {
        try {
            return await this.prisma.user.update({ where: { uuid }, data });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
                throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
            }
            throw e;
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }
        return user;
    }

    async getUserByUuid(uuid: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { uuid } });
        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }
        return user;
    }

    async isUserExists(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return user !== null;
    }

    async profile(uuid: string): Promise<TUser> {
        const user = await this.prisma.user.findUnique({
            where: { uuid },
            select: {
                uuid: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }
        return user;
    }
}
