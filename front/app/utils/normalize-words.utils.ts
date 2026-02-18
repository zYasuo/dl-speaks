import type { TWordEntry, TWords } from "@shared/schemas/dictionary/words.schema";

export function normalizeWords(data: TWords): TWordEntry | null {
    if (Array.isArray(data)) return data[0] ?? null;
    return (data as TWordEntry)?.word ? (data as TWordEntry) : null;
}