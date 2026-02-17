"use server";

import { API_ROUTES } from "@/app/config/api/api-config";
import { getApiRequestInit } from "@/app/config/api/api-client";
import type { IActionResponse } from "@/app/types/api/api.types";
import type { IWords } from "@/app/types/dictionary/wors.types";

export type TGetWordsState = IActionResponse<IWords> | null;

export async function getWords(
    _prevState: TGetWordsState,
    formData: FormData
): Promise<TGetWordsState> {
    try {
        const language = String(formData.get("language") ?? "en");
        const word = String(formData.get("word") ?? "");
        const route = API_ROUTES.DICTIONARY.GET_WORDS;
        const { url, init } = getApiRequestInit(route, {
            pathParams: { language, word }
        });

        const response = await fetch(url, init);
        const data: IWords = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: "Error getting words",
                error: "Error getting words",
                data: {} as IWords
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
            data: {} as IWords
        };
    }
}
