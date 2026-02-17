import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { DICTIONARY_MODULE_TOKENS } from "../constants/dictonary.tokens";

export interface DictionaryEntry {
    word: string;
    phonetic?: string;
    phonetics?: Array<{ text?: string; audio?: string }>;
    origin?: string;
    meanings: Array<{
        partOfSpeech: string;
        definitions: Array<{
            definition: string;
            example?: string;
            synonyms?: string[];
            antonyms?: string[];
        }>;
    }>;
}

@Injectable()
export class DictionaryApiClient {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.CLIENT_API) private readonly baseUrl: string,
        private readonly http_service: HttpService,
    ) {}

    async getWord(language: string, word: string): Promise<DictionaryEntry[]> {
        const url = `${this.baseUrl}/${language}/${encodeURIComponent(word)}`;
        const { data } = await firstValueFrom(
            this.http_service.get<DictionaryEntry[]>(url),
        );
        return data;
    }
}
