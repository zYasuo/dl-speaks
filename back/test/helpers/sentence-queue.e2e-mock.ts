import {
    SENTENCE_JOB_SYNC,
    SENTENCE_SYNC_CRON,
} from "../../src/modules/dictionary/constants/dictionary.constants";

export const mockSentenceQueue = {
    getRepeatableJobs: async () =>
        Promise.resolve([
            {
                key: "e2e-mock",
                name: SENTENCE_JOB_SYNC,
                pattern: SENTENCE_SYNC_CRON,
            },
        ]),
    add: async () => Promise.resolve(undefined),
};
