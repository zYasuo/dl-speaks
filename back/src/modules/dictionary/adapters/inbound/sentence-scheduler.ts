import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import {
    SENTENCE_JOB_SYNC,
    SENTENCE_SYNC_CRON,
} from "../../constants/dictionary.constants";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import type { ISentenceQueue } from "./interfaces/sentence-queue.interface";

@Injectable()
export class SentenceScheduler implements OnModuleInit {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.SENTENCE_QUEUE)
        private readonly queue: ISentenceQueue
    ) {}

    async onModuleInit(): Promise<void> {
        const repeatable = await this.queue.getRepeatableJobs();
        const alreadyScheduled = repeatable.some(
            (j) => j.pattern === SENTENCE_SYNC_CRON && j.name === SENTENCE_JOB_SYNC
        );
        if (!alreadyScheduled) {
            await this.queue.add(
                SENTENCE_JOB_SYNC,
                {},
                { repeat: { pattern: SENTENCE_SYNC_CRON } }
            );
        }
    }
}
