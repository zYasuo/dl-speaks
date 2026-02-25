import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import type { IDatabaseService } from "src/modules/db/domain/ports/database.port";
import type {
    ISentenceRepository,
    SentenceToUpsert,
} from "../../domain/ports/sentence-repository.port";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class SentenceRepository implements ISentenceRepository {
    private readonly prisma: PrismaClient;

    constructor(
        @Inject(DATABASE_MODULE_TOKENS.DATABASE_SERVICE)
        private readonly database: IDatabaseService
    ) {
        this.prisma = this.database.getClient();
    }

    async upsertMany(sentences: SentenceToUpsert[]): Promise<number> {
        if (sentences.length === 0) return 0;
        const result = await this.prisma.sentence.createMany({
            data: sentences.map((s) => ({
                external_id: s.externalId,
                text: s.text,
                lang: s.lang,
            })),
            skipDuplicates: true,
        });
        return result.count;
    }
}
