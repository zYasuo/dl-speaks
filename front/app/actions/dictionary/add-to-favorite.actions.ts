"use server";

import { API_ROUTES } from "@/app/config/api/api-config";
import { IActionResponse } from "@/app/types/api/api.types";
import { TAddToFavorite } from "@/app/(ui)/dashboard/dictionary/words/schema/add-to-favorite.schema";
import { getApiRequestInit } from "@/app/config/api/api-client";

export async function addToFavorite(formData: FormData): Promise<IActionResponse<TAddToFavorite>> {
    try {
        const wordId = Number(formData.get("wordId"));
        const userId = Number(formData.get("userId"));
        const route = API_ROUTES.DICTIONARY.ADD_TO_FAVORITE;
        const { url, init } = getApiRequestInit(route, {
            body: { wordId, userId }
        });
        const response = await fetch(url, init);
        if (!response.ok) {
            return { success: false, message: "Error adding to favorite", error: "Error adding to favorite", data: {} as TAddToFavorite };
        }
        return { success: true, message: "Word added to favorite", error: "", data: { wordId, userId } };
    } catch (error) {
        return {
            success: false,
            message: "Error adding to favorite",
            error: error instanceof Error ? error.message : "Unknown error",
            data: {} as TAddToFavorite
        };
    }
}
