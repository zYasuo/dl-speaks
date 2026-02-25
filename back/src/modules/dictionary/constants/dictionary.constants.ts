export const RECENT_WORDS_CACHE_KEY = "recent_words" as const;
export const RECENT_WORDS_MAX_SIZE = 10;
export const RECENT_WORDS_CACHE_TTL_SECONDS = 60 * 60 * 24;

export const WORD_INCLUDE = {
    phonetics: true,
    meanings: {
        include: {
            definitions: {
                include: { synonyms: true, antonyms: true },
            },
        },
    },
} as const;

export const SENTENCE_QUEUE_NAME = "sentence";
export const SENTENCE_JOB_SYNC = "sync-sentences-from-tatoeba";
export const SENTENCE_SYNC_CRON = "0 */6 * * *";
export const SENTENCE_SYNC_PAGE_SIZE = 50;
export const SENTENCE_SYNC_SEED_QUERIES = [
    "the",
    "a",
    "to",
    "is",
    "and",
    "of",
    "in",
    "it",
    "for",
    "on",
];
