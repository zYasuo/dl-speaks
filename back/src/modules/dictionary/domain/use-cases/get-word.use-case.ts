import type { IDictionaryApiClient } from "../ports/dictionary-api.port";
import type { FindWordByWordUseCase } from "./find-word-by-word.use-case";
import type { CreateWordFromApiUseCase } from "./create-word-from-api.use-case";
import type { AddToRecentWordsUseCase } from "./add-to-recent-words.use-case";
import { WordNotFoundError } from "src/commons/domain/exceptions/word.exceptions";

export class GetWordUseCase {
    constructor(
        private readonly dictionaryApiClient: IDictionaryApiClient,
        private readonly findWordByWordUseCase: FindWordByWordUseCase,
        private readonly createWordFromApiUseCase: CreateWordFromApiUseCase,
        private readonly addToRecentWordsUseCase: AddToRecentWordsUseCase
    ) {}

    async execute(language: string, word: string) {
        try {
            const data = await this.dictionaryApiClient.getWord(language, word);
            const entry = Array.isArray(data) ? data[0] : data;

            if (entry) {
                const existing = await this.findWordByWordUseCase.execute(entry.word);
                if (!existing) {
                    await this.createWordFromApiUseCase.execute(entry);
                }
            }

            const wordToRecent = (entry?.word ?? word).trim().toLowerCase();
            if (wordToRecent) {
                try {
                    await this.addToRecentWordsUseCase.execute(wordToRecent);
                } catch {}
            }

            return data;
        } catch (error: unknown) {
            const err = error as { response?: { status?: number } };
            if (err?.response?.status === 404) {
                throw new WordNotFoundError(`Word "${word}" not found`);
            }
            throw error;
        }
    }
}
