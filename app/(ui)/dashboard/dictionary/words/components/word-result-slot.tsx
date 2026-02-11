"use client";

import { useDictionaryStore } from "@/lib/stores/dictionary.store";
import WordResult from "./word-result";

export default function WordResultSlot() {
    const result = useDictionaryStore((s) => s.result);

    if (!result) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 w-full min-w-0">
            <WordResult entry={result} />
        </div>
    );
}
