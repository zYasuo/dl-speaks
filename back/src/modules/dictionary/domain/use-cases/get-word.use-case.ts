import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictonary.tokens";
import type { DictionaryApiClient } from "../../client/client.api";
import { FindWordByWordUseCase } from "../../modules/words/domain/use-cases/find-word-by-word.use-case";
import { CreateWordFromApiUseCase } from "../../modules/words/domain/use-cases/create-word-from-api.use-case";
import { AddToRecentWordsUseCase } from "../../modules/words/domain/use-cases/add-to-recent-words.use-case";

@Injectable()
export class GetWordUseCase {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.DICTIONARY_CLIENT)
        private readonly dictionaryApiClient: DictionaryApiClient,
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
                throw new NotFoundException(`Word "${word}" not found`);
            }
            throw error;
        }
    }
}
