import type { IWordRepository } from "../ports/word-repository.port";

export class AddToFavoriteUseCase {
    constructor(private readonly wordRepository: IWordRepository) {}

    async execute(data: { wordId: number; userId: number }): Promise<void> {
        return this.wordRepository.addToFavorite(data);
    }
}
