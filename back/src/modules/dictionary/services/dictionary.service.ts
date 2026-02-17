import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DICTIONARY_MODULE_TOKENS } from "../constants/dictonary.tokens";
import type { IDictionaryService } from "./interfaces/dictionary-service.interface";
import type { DictionaryApiClient } from "../client/client.api";
import type { IWordService } from "../modules/words/services/interfaces/words-service.interface";

@Injectable()
export class DictionaryService implements IDictionaryService {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.DICTIONARY_CLIENT)
        private readonly dictionary_api_client: DictionaryApiClient,
        @Inject(DICTIONARY_MODULE_TOKENS.WORDS_SERVICE)
        private readonly words_service: IWordService
    ) {}

    async getWord(language: string, word: string) {
        try {
            const data = await this.dictionary_api_client.getWord(language, word);
            const entry = Array.isArray(data) ? data[0] : data;

            if (entry) {
                const existing = await this.words_service.findByWord(entry.word);
                if (!existing) {
                    await this.words_service.createFromApiEntry(entry);
                }
            }

            const wordToRecent = (entry?.word ?? word).trim().toLowerCase();
            if (wordToRecent) {
                try {
                    await this.words_service.addToRecentWords(wordToRecent);
                } catch {}
            }

            return data;
        } catch (error) {
            if (error?.response?.status === 404) {
                throw new NotFoundException(`Word "${word}" not found`);
            }
            throw error;
        }
    }
}
