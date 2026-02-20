import { z } from "zod";

export const SGetWords = z.object({
  language: z
    .string()
    .min(1, { message: "Language is required" })
    .max(2, { message: "Language must be 2 characters" }),
  word: z
    .string()
    .min(1, { message: "Word is required" })
    .max(30, { message: "Word must be less than 30 characters" }),
});

export type TGetWords = z.infer<typeof SGetWords>;
