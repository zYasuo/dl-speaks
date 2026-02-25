import type { ITatoebaClient } from "../ports/tatoeba-client.port";
import type { ISentenceRepository } from "../ports/sentence-repository.port";
import {
    SENTENCE_SYNC_PAGE_SIZE,
    SENTENCE_SYNC_SEED_QUERIES,
} from "../../constants/dictionary.constants";

export class SyncSentencesFromTatoebaUseCase {
    constructor(
        private readonly tatoebaClient: ITatoebaClient,
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
