import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import {
    SENTENCE_JOB_SYNC,
    SENTENCE_QUEUE_NAME,
} from "../../constants/dictionary.constants";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import { SyncSentencesFromTatoebaUseCase } from "../../domain/use-cases/sync-sentences-from-tatoeba.use-case";

@Processor(SENTENCE_QUEUE_NAME)
export class SentenceProcessor extends WorkerHost {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.SYNC_SENTENCES_FROM_TATOEBA_USE_CASE)
        private readonly syncSentences: SyncSentencesFromTatoebaUseCase
    ) {
        super();
    }

    async process(job: Job): Promise<void> {
        if (job.name === SENTENCE_JOB_SYNC) {
            await this.syncSentences.execute();
        }
    }
}
