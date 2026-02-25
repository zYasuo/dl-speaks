import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../../src/modules/db/database.module";
import { AuthModule } from "../../src/modules/auth/auth.module";
import redisConfig from "../../src/config/redis/redis.config";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
        DatabaseModule,
        AuthModule,
    ],
})
export class AuthE2eModule {}
