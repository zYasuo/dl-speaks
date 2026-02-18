import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "../../db/constants/db-tokens.constants";
import type { IDatabaseService } from "src/modules/db/services/interfaces/database-config-service.interface";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";
import { IUserService } from "./interfaces/user-service.interface";
import type { TSignup } from "@shared/schemas/auth/signup.schema";
import type { TUser, TUserUpdate } from "@shared/schemas/user/user.schema";

@Injectable()
export class UserService implements IUserService {
    private readonly prisma: PrismaClient;

    constructor(@Inject(DATABASE_MODULE_TOKENS.DATABASE_SERVICE) private readonly database: IDatabaseService) {
        this.prisma = this.database.getClient();
    }

    async createUser(user: TSignup): Promise<User> {
        const exists = await this.isUserExists(user.email);
        if (exists) {
            throw new BadRequestException(USER_ERRORS.USER_ALREADY_EXISTS);
        }
        return this.prisma.user.create({ data: user });
    }

    async deleteUser(uuid: string): Promise<void> {
        await this.getUserByUuid(uuid);
        await this.prisma.user.delete({ where: { uuid } });
    }

    async updateUser(uuid: string, data: TUserUpdate): Promise<User> {
        await this.getUserByUuid(uuid);
        return this.prisma.user.update({ where: { uuid }, data });
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
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user !== null;
    }

    async profile(uuid: string): Promise<TUser> {
        const user = await this.getUserByUuid(uuid);
        return {
            uuid: user.uuid,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
}
