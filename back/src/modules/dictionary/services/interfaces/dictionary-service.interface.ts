import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";

export interface IDictionaryService {
    getWord(language: string, word: string): Promise<TWordEntry[]>;
}
