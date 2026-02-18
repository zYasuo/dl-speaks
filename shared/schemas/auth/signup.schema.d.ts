import { z } from "zod";
export declare const SSignup: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type TSignup = z.infer<typeof SSignup>;
export declare const SSignupResponse: z.ZodObject<{
    user: z.ZodObject<{
        uuid: z.ZodUUID;
        email: z.ZodEmail;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            USER: "USER";
        }>;
        created_at: z.ZodDate;
    }, z.core.$strip>;
}, z.core.$strip>;
export type TSignupResponse = z.infer<typeof SSignupResponse>;
