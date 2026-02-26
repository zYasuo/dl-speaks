"use client";

import { useRef, useState } from "react";
import { Volume2, Quote } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TWordEntry, TMeaning, TDefinition, TPhonetic } from "@shared/schemas/dictionary/words.schema";
import { cn } from "@/lib/utils";

function getAudioUrl(audio?: string): string | null {
    if (!audio) return null;
    return audio.startsWith("//") ? `https:${audio}` : audio;
}

function DefinitionItem({ definition, index }: { definition: TDefinition; index: number }) {
    return (
        <li className="relative pl-5 pb-4 last:pb-0 min-w-0">
            <span className="absolute left-0 top-0.5 size-2 rounded-full bg-primary/60 shrink-0" aria-hidden />
            <p className="text-foreground/95 text-sm leading-relaxed wrap-break-word">{definition.definition}</p>
            {definition.example && (
                <div className="mt-2 flex gap-2 rounded-md bg-muted/60 px-3 py-2 text-muted-foreground min-w-0">
                    <Quote className="size-3.5 shrink-0 mt-0.5" />
                    <p className="text-xs italic wrap-break-word min-w-0">&ldquo;{definition.example}&rdquo;</p>
                </div>
            )}
            {(definition.synonyms?.length ?? 0) > 0 && (
                <p className="mt-1.5 text-xs text-muted-foreground wrap-break-word">
                    <span className="font-medium">Synonyms:</span>{" "}
                    {definition.synonyms!.slice(0, 5).join(", ")}
                </p>
            )}
        </li>
    );
}

function MeaningBlock({ meaning }: { meaning: TMeaning }) {
    return (
        <section className="space-y-3 min-w-0">
            <Badge
                variant="secondary"
                className="rounded-md px-2.5 py-0.5 text-xs font-medium capitalize text-primary shrink-0 w-fit"
            >
                {meaning.partOfSpeech}
            </Badge>
            <ul className="space-y-0 list-none min-w-0">
                {meaning.definitions.map((def: TDefinition, i: number) => (
                    <DefinitionItem key={i} definition={def} index={i} />
                ))}
            </ul>
        </section>
    );
}

export default function WordResult({ entry }: { entry: TWordEntry }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);

    const audioSrc = entry.phonetics?.find((p: TPhonetic) => p.audio)?.audio;
    const audioUrl = getAudioUrl(audioSrc);
    const phoneticText = entry.phonetic ?? entry.phonetics?.find((p: TPhonetic) => p.text)?.text;

    const playAudio = () => {
        if (!audioUrl) return;
        const el = audioRef.current;
        if (!el) return;
        if (playing) {
            el.pause();
            el.currentTime = 0;
        } else {
            el.play();
        }
        setPlaying(!playing);
    };

    return (
        <Card
            size="sm"
            className={cn(
                "w-full min-w-0 max-w-full overflow-hidden border-primary/15 bg-linear-to-b from-card to-card/80 shadow-md transition-shadow hover:shadow-lg",
            )}
        >
            <audio
                ref={audioRef}
                src={audioUrl ?? undefined}
                onEnded={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                className="hidden"
            />
            <CardHeader className="space-y-1 pb-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl wrap-break-word min-w-0">
                        {entry.word}
                    </h2>
                    {audioUrl && (
                        <button
                            type="button"
                            onClick={playAudio}
                            aria-label="Play pronunciation"
                            className={cn(
                                "inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20",
                                playing && "bg-primary/20",
                            )}
                        >
                            <Volume2 className="size-4" />
                        </button>
                    )}
                </div>
                {phoneticText && (
                    <p className="text-sm text-muted-foreground font-medium wrap-break-word">{phoneticText}</p>
                )}
                {entry.origin && (
                    <p className="mt-2 pt-2 text-xs italic text-muted-foreground border-t border-border/60 wrap-break-word">
                        Origin: {entry.origin}
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-6 pt-0 min-w-0 overflow-hidden">
                {entry.meanings.map((meaning: TMeaning, i: number) => (
                    <MeaningBlock key={i} meaning={meaning} />
                ))}
            </CardContent>
        </Card>
    );
}
