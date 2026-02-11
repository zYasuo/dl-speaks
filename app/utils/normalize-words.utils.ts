import type { IWordEntry, IWords } from "@/app/types/dictionary/wors.types";


export function normalizeWords(data: IWords): IWordEntry | null {
    if (Array.isArray(data)) return data[0] ?? null;
    return (data as IWordEntry)?.word ? (data as IWordEntry) : null;
}