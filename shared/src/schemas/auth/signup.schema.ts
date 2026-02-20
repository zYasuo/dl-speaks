import { z } from "zod";
import { SUserPublic } from "../user/user.schema";

export const SSignup = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type TSignup = z.infer<typeof SSignup>;

export const SSignupResponse = z.object({
  user: SUserPublic,
});

export type TSignupResponse = z.infer<typeof SSignupResponse>;
