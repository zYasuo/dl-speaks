import { z } from "zod";
export declare const SPhonetic: z.ZodObject<{
    text: z.ZodOptional<z.ZodString>;
    audio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type TPhonetic = z.infer<typeof SPhonetic>;
export declare const SDefinition: z.ZodObject<{
    definition: z.ZodString;
    example: z.ZodOptional<z.ZodString>;
    synonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
    antonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type TDefinition = z.infer<typeof SDefinition>;
export declare const SMeaning: z.ZodObject<{
    partOfSpeech: z.ZodString;
    definitions: z.ZodArray<z.ZodObject<{
        definition: z.ZodString;
        example: z.ZodOptional<z.ZodString>;
        synonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
        antonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type TMeaning = z.infer<typeof SMeaning>;
export declare const SWordEntry: z.ZodObject<{
    word: z.ZodString;
    phonetic: z.ZodOptional<z.ZodString>;
    phonetics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    origin: z.ZodOptional<z.ZodString>;
    meanings: z.ZodArray<z.ZodObject<{
        partOfSpeech: z.ZodString;
        definitions: z.ZodArray<z.ZodObject<{
            definition: z.ZodString;
            example: z.ZodOptional<z.ZodString>;
            synonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
            antonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type TWordEntry = z.infer<typeof SWordEntry>;
export declare const SWords: z.ZodUnion<readonly [z.ZodObject<{
    word: z.ZodString;
    phonetic: z.ZodOptional<z.ZodString>;
    phonetics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    origin: z.ZodOptional<z.ZodString>;
    meanings: z.ZodArray<z.ZodObject<{
        partOfSpeech: z.ZodString;
        definitions: z.ZodArray<z.ZodObject<{
            definition: z.ZodString;
            example: z.ZodOptional<z.ZodString>;
            synonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
            antonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodArray<z.ZodObject<{
    word: z.ZodString;
    phonetic: z.ZodOptional<z.ZodString>;
    phonetics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    origin: z.ZodOptional<z.ZodString>;
    meanings: z.ZodArray<z.ZodObject<{
        partOfSpeech: z.ZodString;
        definitions: z.ZodArray<z.ZodObject<{
            definition: z.ZodString;
            example: z.ZodOptional<z.ZodString>;
            synonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
            antonyms: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>>]>;
export type TWords = z.infer<typeof SWords>;
