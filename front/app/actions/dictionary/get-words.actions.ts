"use server";

import { API_ROUTES } from "@/app/config/api/api-config";
import { getApiRequestInit } from "@/app/config/api/api-client";
import type { IActionResponse } from "@/app/types/api/api.types";
import type { TGetWords } from "@shared/schemas/dictionary/get-words.schema";
import type { TWords } from "@shared/schemas/dictionary/words.schema";

export type TGetWordsState = IActionResponse<TWords>;

export async function getWords(form_data: TGetWords): Promise<TGetWordsState> {
    try {
        const { language, word } = form_data;
        const route = API_ROUTES.DICTIONARY.GET_WORDS;
        const { url, init } = getApiRequestInit(route, {
            pathParams: { language, word }
        });

        const response = await fetch(url, init);
        const data: TWords = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: "Error getting words",
                error: "Error getting words",
                data: {} as TWords
            };
        }
        return {
            success: true,
            message: "Words fetched successfully",
            error: "",
            data: data
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            message: "Error getting words",
            error: errorMessage,
            data: {} as TWords
        };
    }
}
