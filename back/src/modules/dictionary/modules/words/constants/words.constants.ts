export const RECENT_WORDS_CACHE_KEY = "recent_words" as const;

export const RECENT_WORDS_MAX_SIZE = 10;

export const RECENT_WORDS_CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h

export const WORD_INCLUDE = {
    phonetics: true,
    meanings: {
        include: {
            definitions: {
                include: { synonyms: true, antonyms: true }
            }
        }
    }
} as const;
