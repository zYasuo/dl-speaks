import { PrismaClient } from "@prisma/client";

export interface IDatabaseService {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getClient(): PrismaClient;
}
