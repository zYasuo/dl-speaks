import { Inject, Injectable } from "@nestjs/common";
import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";
import type { IWordRepository } from "../ports/word-repository.port";
import type { WordEntity } from "../entities/word.entity";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";

@Injectable()
export class CreateWordFromApiUseCase {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY)
        private readonly wordRepository: IWordRepository
    ) {}

    async execute(entry: TWordEntry): Promise<WordEntity> {
        return this.wordRepository.createFromApiEntry(entry);
    }
}
