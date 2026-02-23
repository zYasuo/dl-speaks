import { PrismaClient } from "@prisma/client";
import type { IUserRepository } from "../../domain/ports/user-repository,port";
import { TSignup } from "@shared/schemas/auth/signup.schema";
import { UserEntity } from "../../domain/entities/user.entity";
import { Prisma } from "@prisma/client";
import { ConflictException } from "@nestjs/common";
import { USER_ERRORS } from "src/commons/constants/errors/user-errors.constants";

export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

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
}
