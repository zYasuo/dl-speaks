import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { IDatabaseService } from "./interfaces/database-config-service.interface";


@Injectable()
export class DatabaseConfigService implements IDatabaseService {
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
