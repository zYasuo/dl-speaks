import { z } from "zod";
export declare const SAddToFavorite: z.ZodObject<{
    wordId: z.ZodNumber;
}, z.core.$strip>;
export type TAddToFavorite = z.infer<typeof SAddToFavorite>;
