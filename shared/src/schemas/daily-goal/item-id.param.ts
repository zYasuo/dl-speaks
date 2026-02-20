import { z } from "zod";

export const SItemIdParam = z.coerce.number().int().positive();

export type TItemIdParam = z.infer<typeof SItemIdParam>;
