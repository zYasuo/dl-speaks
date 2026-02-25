import type { TTatoebaSentence } from "@shared/schemas/tatoeba/tatoeba-sentence.schema";

export interface TTatoebaSearchParams {
    from: string;
    query: string;
    to?: string;
    page?: [number, number];
    options?: number;
}

export interface ITatoebaClient {
    searchSentences(params: TTatoebaSearchParams): Promise<TTatoebaSentence[]>;
}
