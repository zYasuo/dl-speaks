import { Inject, Injectable } from "@nestjs/common";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import type { ITatoebaClient } from "../ports/tatoeba-client.port";
import type { ISentenceRepository } from "../ports/sentence-repository.port";
import {
    SENTENCE_SYNC_PAGE_SIZE,
    SENTENCE_SYNC_SEED_QUERIES,
} from "../../constants/dictionary.constants";

@Injectable()
export class SyncSentencesFromTatoebaUseCase {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.TATOEBA_CLIENT)
        private readonly tatoebaClient: ITatoebaClient,
        @Inject(DICTIONARY_MODULE_TOKENS.SENTENCE_REPOSITORY)
        private readonly sentenceRepository: ISentenceRepository
    ) {}

    async execute(): Promise<{ fetched: number; saved: number }> {
        const query =
            SENTENCE_SYNC_SEED_QUERIES[
                Math.floor(Math.random() * SENTENCE_SYNC_SEED_QUERIES.length)
            ];
        const sentences = await this.tatoebaClient.searchSentences({
            from: "eng",
            query,
            page: [0, SENTENCE_SYNC_PAGE_SIZE],
            options: 0x1,
        });
        const toUpsert = sentences.map((s) => ({
            externalId: s.id,
            text: s.text,
            lang: s.lang,
        }));
        const saved = await this.sentenceRepository.upsertMany(toUpsert);
        return { fetched: sentences.length, saved };
    }
}
