import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import type { IDatabaseService } from "src/modules/db/domain/ports/database.port";
import type { IUserRepository } from "../../domain/ports/user-repository,port";
import { UserEntity } from "../../domain/entities/user.entity";
import { TSignup } from "@shared/schemas/auth/signup.schema";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";

@Injectable()
export class UserRepository implements IUserRepository {
    private readonly prisma: PrismaClient;

    constructor(
        @Inject(DATABASE_MODULE_TOKENS.DATABASE_SERVICE)
        private readonly database: IDatabaseService
    ) {
        this.prisma = this.database.getClient();
    }

    async createUser(user: TSignup): Promise<UserEntity> {
        try {
            const created = await this.prisma.user.create({ data: user });
            return UserEntity.fromPrisma(created);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new ConflictException(USER_ERRORS.USER_ALREADY_EXISTS);
            }
            throw e;
        }
    }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user ? UserEntity.fromPrisma(user) : null;
    }

    async getUserByUuid(uuid: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { uuid } });
        return user ? UserEntity.fromPrisma(user) : null;
    }

    async isUserExists(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return user !== null;
    }
}
