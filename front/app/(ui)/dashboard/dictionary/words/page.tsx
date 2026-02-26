import { H1 } from "@/components/ui/h1";
import { P } from "@/components/ui/p";
import FormGetWords from "./components/form-get-words";
import RecentWordsBadge from "./components/recent-words-badge";
import WordResultSlot from "./components/word-result-slot";
import { Metadata } from "next";
import { getWords } from "@/app/actions/dictionary/get-words.actions";
import { TGetWords } from "@shared/schemas/dictionary/get-words.schema";

export const metadata: Metadata = {
    title: "Dictionary",
    description: "Dictionary"
};

export default function Page() {
    async function handleGetWords(form_data: TGetWords) {
        "use server";
        return getWords(form_data);
    }
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] w-full max-w-2xl mx-auto px-8 py-6">
            <div className="space-y-4 w-full">
                <H1>Dictionary</H1>
                <div className="text-center">
                    <P>Get words from the dictionary to learn and practice</P>
                </div>
                <FormGetWords onGetWords={handleGetWords} />
                <div className="flex justify-center">
                    <RecentWordsBadge onGetWords={handleGetWords} />
                </div>
                <WordResultSlot />
            </div>
        </div>
    );
}
