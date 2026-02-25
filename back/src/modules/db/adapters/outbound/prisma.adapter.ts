import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import type { IDatabaseService } from "../../domain/ports/database.port";

@Injectable()
export class PrismaAdapter implements IDatabaseService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async onModuleInit() {
        await this.prisma.$connect();
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect();
    }

    getClient(): PrismaClient {
        return this.prisma;
    }
}
