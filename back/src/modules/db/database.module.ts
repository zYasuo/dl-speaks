import { Module } from "@nestjs/common";
import { DATABASE_MODULE_TOKENS } from "./constants/db-tokens.constants";
import { PrismaAdapter } from "./adapters/outbound/prisma.adapter";

@Module({
    providers: [
        PrismaAdapter,
        {
            provide: DATABASE_MODULE_TOKENS.PRISMA_CLIENT,
            useFactory: (adapter: PrismaAdapter) => adapter.getClient(),
            inject: [PrismaAdapter],
        },
    ],
    exports: [DATABASE_MODULE_TOKENS.PRISMA_CLIENT],
})
export class DatabaseModule {}