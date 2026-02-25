import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";

export interface IDictionaryApiClient {
    getWord(language: string, word: string): Promise<TWordEntry[]>;
}
