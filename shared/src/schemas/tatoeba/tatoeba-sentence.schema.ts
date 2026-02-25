import { z } from "zod";

export const STatoebaSentence = z.object({
  id: z.number(),
  text: z.string(),
  lang: z.string(),
  tags: z.array(z.number()).optional(),
  audio: z.union([z.literal(0), z.literal(1)]).optional(),
  user_id: z.number().optional(),
  username: z.string().optional(),
  direct: z.array(z.number()).optional(),
  indirect: z.array(z.number()).optional(),
});

export type TTatoebaSentence = z.infer<typeof STatoebaSentence>;

export const STatoebaSearchResult = z.object({
  version: z.number(),
  total: z.number(),
  sentences: z.array(STatoebaSentence),
});

export type TTatoebaSearchResult = z.infer<typeof STatoebaSearchResult>;

export const STatoebaJsonRpcResponse = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number()]),
  result: STatoebaSearchResult,
});

export type TTatoebaJsonRpcResponse = z.infer<typeof STatoebaJsonRpcResponse>;
