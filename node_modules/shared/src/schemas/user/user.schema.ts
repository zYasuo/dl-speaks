import { z } from "zod";

export const SUser = z.object({
  uuid: z.uuid(),
  role: z.enum(["USER", "ADMIN"]),
  email: z.email(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type TUser = z.infer<typeof SUser>;

export const SUserPublic = SUser.pick({
  uuid: true,
  email: true,
  role: true,
  created_at: true,
});

export type TUserPublic = z.infer<typeof SUserPublic>;

export const SUserUpdate = z.object({
  email: z.email().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export type TUserUpdate = z.infer<typeof SUserUpdate>;
