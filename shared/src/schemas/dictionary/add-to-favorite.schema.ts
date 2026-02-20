import { z } from "zod";

export const SAddToFavorite = z.object({
  wordId: z.number().min(1, { message: "Word ID is required" }),
});

export type TAddToFavorite = z.infer<typeof SAddToFavorite>;
