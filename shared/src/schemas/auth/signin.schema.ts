import { z } from "zod";
import { SUserPublic } from "../user/user.schema";

export const SSignin = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type TSignin = z.infer<typeof SSignin>;

export const SSigninResponse = z.object({
  user: SUserPublic,
  access_token: z.string(),
  token_type: z.enum(["Bearer"]),
});

export type TSigninResponse = z.infer<typeof SSigninResponse>;
