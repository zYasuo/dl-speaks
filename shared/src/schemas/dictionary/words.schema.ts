import { z } from "zod";

export const SPhonetic = z.object({
  text: z.string().optional(),
  audio: z.string().optional(),
});

export type TPhonetic = z.infer<typeof SPhonetic>;

export const SDefinition = z.object({
  definition: z.string(),
  example: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  antonyms: z.array(z.string()).optional(),
});

export type TDefinition = z.infer<typeof SDefinition>;

export const SMeaning = z.object({
  partOfSpeech: z.string(),
  definitions: z.array(SDefinition),
});

export type TMeaning = z.infer<typeof SMeaning>;

export const SWordEntry = z.object({
  word: z.string(),
  phonetic: z.string().optional(),
  phonetics: z.array(SPhonetic).optional(),
  origin: z.string().optional(),
  meanings: z.array(SMeaning),
});

export type TWordEntry = z.infer<typeof SWordEntry>;

export const SWords = z.union([SWordEntry, z.array(SWordEntry)]);

export type TWords = z.infer<typeof SWords>;
