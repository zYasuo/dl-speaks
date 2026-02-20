import { create } from "zustand";
import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";

interface DictionaryStore {
    result: TWordEntry | null;
    setResult: (entry: TWordEntry | null) => void;
}

export const useDictionaryStore = create<DictionaryStore>((set) => ({
    result: null,
    setResult: (entry) => set({ result: entry }),
}));
