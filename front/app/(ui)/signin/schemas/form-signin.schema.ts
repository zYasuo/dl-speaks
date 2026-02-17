import { z } from "zod";

export const SFormSignin = z.object({
    email: z.email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
});

export type TFormSignin = z.infer<typeof SFormSignin>;
