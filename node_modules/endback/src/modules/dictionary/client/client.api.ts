import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { DICTIONARY_MODULE_TOKENS } from "../constants/dictonary.tokens";
import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";

@Injectable()
export class DictionaryApiClient {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.CLIENT_API) private readonly baseUrl: string,
        private readonly http_service: HttpService,
    ) {}

    async getWord(language: string, word: string): Promise<TWordEntry[]> {
        const url = `${this.baseUrl}/${language}/${encodeURIComponent(word)}`;
        const { data } = await firstValueFrom(
            this.http_service.get<TWordEntry[]>(url),
        );
        return data;
    }
}
