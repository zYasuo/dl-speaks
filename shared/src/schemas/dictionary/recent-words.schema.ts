import { z } from "zod";

export const SRecentWords = z.object({
  words: z.array(z.string()),
});

export type TRecentWords = z.infer<typeof SRecentWords>;
