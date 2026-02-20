import { Module } from "@nestjs/common";
import { DATABASE_MODULE_TOKENS } from "./constants/db-tokens.constants";
import { DatabaseConfigService } from "./services/database-config.service";

@Module({
    providers: [
        {
            provide: DATABASE_MODULE_TOKENS.DATABASE_SERVICE,
            useClass: DatabaseConfigService,
        },
    ],
    exports: [DATABASE_MODULE_TOKENS.DATABASE_SERVICE],
})
export class DatabaseModule {}