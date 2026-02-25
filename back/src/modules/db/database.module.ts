import { Module } from "@nestjs/common";
import { DATABASE_MODULE_TOKENS } from "./constants/db-tokens.constants";
import { PrismaAdapter } from "./adapters/outbound/prisma.adapter";

@Module({
    providers: [
        {
            provide: DATABASE_MODULE_TOKENS.DATABASE_SERVICE,
            useClass: PrismaAdapter,
        },
    ],
    exports: [DATABASE_MODULE_TOKENS.DATABASE_SERVICE],
})
export class DatabaseModule {}