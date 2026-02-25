import { Inject, Injectable } from "@nestjs/common";
import type { IWordRepository } from "../ports/word-repository.port";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";

@Injectable()
export class AddToFavoriteUseCase {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.WORD_REPOSITORY)
        private readonly wordRepository: IWordRepository
    ) {}

    async execute(data: { wordId: number; userId: number }): Promise<void> {
        return this.wordRepository.addToFavorite(data);
    }
}
