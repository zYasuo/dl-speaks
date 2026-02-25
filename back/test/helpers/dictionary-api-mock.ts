import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";

export const mockWordEntry: TWordEntry = {
    word: "hello",
    phonetic: "həˈloʊ",
    phonetics: [{ text: "həˈloʊ", audio: undefined }],
    origin: undefined,
    meanings: [
        {
            partOfSpeech: "noun",
            definitions: [
                {
                    definition: "used as a greeting",
                    example: "Hello, how are you?",
                    synonyms: [],
                    antonyms: [],
                },
            ],
        },
    ],
};

export const mockDictionaryClient = {
    getWord: async (_language: string, _word: string): Promise<TWordEntry[]> => [mockWordEntry],
};
