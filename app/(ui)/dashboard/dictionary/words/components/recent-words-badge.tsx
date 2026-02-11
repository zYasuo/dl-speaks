"use client";

import { useEffect, useState, useActionState, startTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { getRecentWords } from "@/app/actions/dictionary/recents-words.actions";
import { getWords } from "@/app/actions/dictionary/get-words.actions";
import { normalizeWords } from "@/app/utils/normalize-words.utils";
import { useDictionaryStore } from "@/lib/stores/dictionary.store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGE } from "../../constants/language.constants";


const RecentWordsBadge = () => {
    const setResult = useDictionaryStore((s) => s.setResult);
    const [loadingWord, setLoadingWord] = useState<string | null>(null);

    const [recentState, loadRecentsAction] = useActionState(getRecentWords, { items: [] });
    const [getWordsState, getWordsFormAction] = useActionState(getWords, null);

    useEffect(() => {
        startTransition(() => {
            loadRecentsAction();
        });
    }, [loadRecentsAction]);

    useEffect(() => {
        if (getWordsState === null) return;
        setLoadingWord(null);
        if (getWordsState.success) {
            toast.success(getWordsState.message);
            setResult(normalizeWords(getWordsState.data));
        } else {
            toast.error(getWordsState.error);
            setResult(null);
        }
    }, [getWordsState, setResult]);

    const handleWordClick = (word: string) => {
        setLoadingWord(word);
        const formData = new FormData();
        formData.append("language", LANGUAGE.en);
        formData.append("word", word);
        startTransition(() => {
            getWordsFormAction(formData);
        });
    };

    const words = recentState.items.map((item) => item.label);

    return (
        <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto">
            {words.map((word) => {
                const isLoading = loadingWord === word;
                return (
                    <Badge
                        key={word}
                        variant="outline"
                        role="button"
                        tabIndex={0}
                        aria-busy={isLoading}
                        aria-label={isLoading ? `Buscando ${word}...` : `Ver significado de ${word}`}
                        onClick={() => !isLoading && handleWordClick(word)}
                        onKeyDown={(e) => {
                            if ((e.key === "Enter" || e.key === " ") && !isLoading) {
                                e.preventDefault();
                                handleWordClick(word);
                            }
                        }}
                        className={cn(
                            "w-fit cursor-pointer bg-blue-600/10 hover:bg-muted hover:text-muted-foreground inline-flex items-center justify-center gap-1.5",
                            isLoading && "pointer-events-none opacity-80"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
                        ) : (
                            <span className="bg-blue-500 size-1.5 rounded-full shrink-0" aria-hidden />
                        )}
                        <span className="text-sm font-medium whitespace-nowrap leading-none">{word}</span>
                    </Badge>
                );
            })}
        </div>
    );
};

export default RecentWordsBadge;
