import { Inject, Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import type { IUserRepository } from "../../domain/ports/user-repository,port";
import { UserEntity } from "../../domain/entities/user.entity";
import { TSignup } from "@shared/schemas/auth/signup.schema";
import { UserAlreadyExistsError } from "src/commons/domain/exceptions/user.exceptions";

function mapPrismaUserToEntity(prismaUser: {
    id: number;
    uuid: string;
    email: string;
    password: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}): UserEntity {
    return new UserEntity({
        id: prismaUser.id,
        uuid: prismaUser.uuid,
        email: prismaUser.email,
        password: prismaUser.password,
        role: prismaUser.role as "USER" | "ADMIN",
        createdAt: prismaUser.created_at,
        updatedAt: prismaUser.updated_at,
    });
}

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @Inject(DATABASE_MODULE_TOKENS.PRISMA_CLIENT)
        private readonly prisma: PrismaClient
    ) {}

    async createUser(user: TSignup): Promise<UserEntity> {
        try {
            const created = await this.prisma.user.create({ data: user });
            return mapPrismaUserToEntity(created);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new UserAlreadyExistsError();
            }
            throw e;
        }
    }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user ? mapPrismaUserToEntity(user) : null;
    }

    async getUserByUuid(uuid: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { uuid } });
        return user ? mapPrismaUserToEntity(user) : null;
    }

    async isUserExists(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return user !== null;
    }
}
