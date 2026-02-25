import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";
import type { IWordRepository } from "../ports/word-repository.port";
import type { WordEntity } from "../entities/word.entity";

export class CreateWordFromApiUseCase {
    constructor(private readonly wordRepository: IWordRepository) {}

    async execute(entry: TWordEntry): Promise<WordEntity> {
        return this.wordRepository.createFromApiEntry(entry);
    }
}
