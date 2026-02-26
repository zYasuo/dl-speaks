"use client";

import { useEffect, useActionState, startTransition, useTransition } from "react";
import { useForm } from "react-hook-form";
import { SearchIcon } from "lucide-react";
import { SGetWords, TGetWords } from "@shared/schemas/dictionary/get-words.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    Autocomplete,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
    AutocompletePopup
} from "@/components/ui/autocomplete";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { getRecentWords } from "@/app/actions/dictionary/recents-words.actions";
import { TGetWordsState } from "@/app/actions/dictionary/get-words.actions";
import { useDictionaryStore } from "@/lib/stores/dictionary.store";
import { normalizeWords } from "@/app/utils/normalize-words.utils";
import { Spinner } from "@/components/ui/spinner";

type TAutocompleteItem = { label: string; value: string };

interface IFormGetWordsProps {
    onGetWords: (form_data: TGetWords) => Promise<TGetWordsState>;
}

const FormGetWords = ({ onGetWords }: IFormGetWordsProps) => {
    const setResult = useDictionaryStore((s) => s.setResult);
    const [isPending, startTransition] = useTransition();
    const [recentState, loadRecentsAction] = useActionState(getRecentWords, { items: [] });

    const form = useForm<TGetWords>({
        resolver: zodResolver(SGetWords),
        defaultValues: {
            language: "en",
            word: ""
        }
    });

    const word = form.watch("word");

    useEffect(() => {
        startTransition(() => {
            loadRecentsAction();
        });
    }, [loadRecentsAction]);

    async function onSubmit(form_data: TGetWords) {
        startTransition(async () => {
            const result = await onGetWords(form_data);
            if (result.success) {
                toast.success(result.message);
                setResult(normalizeWords(result.data));
                startTransition(() => loadRecentsAction());
            } else {
                toast.error(result.error ?? result.message);
                setResult(null);
            }
        });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <InputGroup className="h-14 w-full rounded-full px-4 shadow-lg">
                <div className="flex flex-1 min-w-0 items-center">
                    <Autocomplete<TAutocompleteItem>
                        items={recentState.items}
                        value={word}
                        onValueChange={(value) => form.setValue("word", value)}
                        submitOnItemClick
                    >
                        <AutocompleteInput
                            aria-label="Search for a word"
                            placeholder="Search for a word..."
                            className="w-full min-w-0 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 text-base md:text-lg [&_input]:h-10 [&_input]:bg-transparent [&_input]:dark:bg-transparent [&_input]:border-0"
                            size="lg"
                        />
                        <AutocompletePopup>
                            <AutocompleteEmpty>No suggestions.</AutocompleteEmpty>
                            <AutocompleteList>
                                {(item) => (
                                    <AutocompleteItem key={item.value} value={item}>
                                        {item.label}
                                    </AutocompleteItem>
                                )}
                            </AutocompleteList>
                        </AutocompletePopup>
                    </Autocomplete>
                </div>
                <InputGroupAddon align="inline-end">
                    <InputGroupButton type="submit" size="icon-sm" className="size-10" aria-label="Search" disabled={isPending}>
                        {isPending ? <Spinner className="size-5" /> : <SearchIcon className="size-5" />}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
};

export default FormGetWords;
