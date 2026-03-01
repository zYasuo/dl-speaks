"use server";

import { API_ROUTES } from "@/app/config/api/api-config";
import { getApiRequestInit } from "@/app/config/api/api-client";
import type { TRecentWords } from "@shared/schemas/dictionary/recent-words.schema";

export type TGetRecentWordsState = { items: { label: string; value: string }[] };

export async function getRecentWords(
    _prevState: TGetRecentWordsState,
    _formData?: FormData
): Promise<TGetRecentWordsState> {
    try {
        const route = API_ROUTES.DICTIONARY.GET_RECENT_WORDS;
        const { url, init } = getApiRequestInit(route);
        const response = await fetch(url, init);
        const json = await response.json();
        const data: TRecentWords = Array.isArray(json) ? { words: json } : json;
        const items =
            data?.words?.length ? data.words.map((w: string) => ({ label: w, value: w })) : [];
        return { items };
    } catch {
        return { items: [] };
    }
}
