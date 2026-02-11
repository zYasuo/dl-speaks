"use server";

import { API_ROUTES } from "@/app/config/api/api-config";
import { getApiRequestInit } from "@/app/config/api/api-client";
import type { IActionResponse } from "@/app/types/api/api.types";
import { IRecentWords } from "@/app/types/dictionary/wors.types";

export type RecentWordsState = { items: { label: string; value: string }[] };

export async function getRecentWordsAction(
    _prevState: RecentWordsState,
    _formData?: FormData
): Promise<RecentWordsState> {
    const res = await getRecentWords();
    const items =
        res.success && res.data?.words?.length
            ? res.data.words.map((w) => ({ label: w, value: w }))
            : [];
    return { items };
}

export async function getRecentWords(): Promise<IActionResponse<IRecentWords>> {
    try {
        const route = API_ROUTES.DICTIONARY.GET_RECENT_WORDS;
        const { url, init } = getApiRequestInit(route);
        const response = await fetch(url, init);
        const json = await response.json();
        const data: IRecentWords = Array.isArray(json) ? { words: json } : json;

        return {
            success: true,
            message: "Recent words fetched successfully",
            error: "",
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error fetching recent words",
            error: error instanceof Error ? error.message : "Unknown error",
            data: { words: [] }
        };
    }
}
