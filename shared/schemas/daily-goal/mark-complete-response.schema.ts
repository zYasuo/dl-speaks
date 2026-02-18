import { z } from "zod";

export const SMarkCompleteResponse = z.object({
    ok: z.literal(true),
});

export type TMarkCompleteResponse = z.infer<typeof SMarkCompleteResponse>;
