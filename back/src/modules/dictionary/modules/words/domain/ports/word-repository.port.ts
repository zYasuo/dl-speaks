import type { WordEntity } from "../entities/word.entity";
import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";

export interface IWordRepository {
    findByWord(word: string): Promise<WordEntity | null>;
    createFromApiEntry(entry: TWordEntry): Promise<WordEntity>;
    addToFavorite(data: { wordId: number; userId: number }): Promise<void>;
}
