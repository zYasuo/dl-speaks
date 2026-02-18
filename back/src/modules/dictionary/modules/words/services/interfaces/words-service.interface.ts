import { Word } from "@prisma/client";
import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";

export interface IWordService {
    findByWord(word: string): Promise<Word | null>;
    createFromApiEntry(entry: TWordEntry): Promise<Word>;
    recentWords(): Promise<string[]>;
    addToRecentWords(word: string): Promise<void>;
    addToFavorite(data: { wordId: number, userId: number }): Promise<void>;
}