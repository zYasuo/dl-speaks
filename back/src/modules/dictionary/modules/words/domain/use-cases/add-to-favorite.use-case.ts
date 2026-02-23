import { Inject, Injectable } from "@nestjs/common";
import type { IWordRepository } from "../ports/word-repository.port";
import { WORDS_MODULE_TOKENS } from "../../constants/words-tokens.constants";

@Injectable()
export class AddToFavoriteUseCase {
    constructor(
        @Inject(WORDS_MODULE_TOKENS.WORD_REPOSITORY)
        private readonly wordRepository: IWordRepository
    ) {}

    async execute(data: { wordId: number; userId: number }): Promise<void> {
        return this.wordRepository.addToFavorite(data);
    }
}
