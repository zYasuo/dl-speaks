import { Word } from "@prisma/client";
import { DictionaryEntry } from "src/modules/dictionary/client/client.api";

export interface IWordService {
    findByWord(word: string): Promise<Word | null>;
    createFromApiEntry(entry: DictionaryEntry): Promise<Word>;
    recentWords(): Promise<string[]>;
    addToRecentWords(word: string): Promise<void>;
    addToFavorite(data: { wordId: number, userId: number }): Promise<void>;
}