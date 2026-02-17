import { create } from "zustand";
import type { IWordEntry } from "@/app/types/dictionary/wors.types";

interface DictionaryStore {
    result: IWordEntry | null;
    setResult: (entry: IWordEntry | null) => void;
}

export const useDictionaryStore = create<DictionaryStore>((set) => ({
    result: null,
    setResult: (entry) => set({ result: entry }),
}));
