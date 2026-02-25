import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import type { TTatoebaJsonRpcResponse } from "@shared/schemas/tatoeba/tatoeba-sentence.schema";
import type {
    ITatoebaClient,
    TTatoebaSearchParams,
} from "../../domain/ports/tatoeba-client.port";

@Injectable()
export class TatoebaClient implements ITatoebaClient {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.TATOEBA_API_URL) private readonly baseUrl: string,
        private readonly httpService: HttpService
    ) {}

    async searchSentences(params: TTatoebaSearchParams) {
        const { from, query, to, page = [0, 20], options = 0x1 } = params;
        const body = {
            jsonrpc: "2.0" as const,
            id: 1,
            method: "search",
            params: {
                version: 1,
                query,
                from,
                ...(to != null && { to }),
                page,
                options,
            },
        };
        const { data } = await firstValueFrom(
            this.httpService.post<TTatoebaJsonRpcResponse>(this.baseUrl, body, {
                headers: { "Content-Type": "application/json" },
            })
        );
        if ("error" in data && data.error) {
            const err = data as { error?: { message?: string } };
            throw new Error(`Tatoeba API error: ${err.error?.message ?? "Unknown"}`);
        }
        return data.result.sentences;
    }
}
