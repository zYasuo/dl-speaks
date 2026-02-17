import type { DictionaryEntry } from "../../client/client.api";

export interface IDictionaryService {
    getWord(language: string, word: string): Promise<DictionaryEntry[]>;
}
