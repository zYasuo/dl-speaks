import { z } from "zod";
export declare const SSignin: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type TSignin = z.infer<typeof SSignin>;
export declare const SSigninResponse: z.ZodObject<{
    user: z.ZodObject<{
        uuid: z.ZodUUID;
        email: z.ZodEmail;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            USER: "USER";
        }>;
        created_at: z.ZodDate;
    }, z.core.$strip>;
    access_token: z.ZodString;
    token_type: z.ZodEnum<{
        Bearer: "Bearer";
    }>;
}, z.core.$strip>;
export type TSigninResponse = z.infer<typeof SSigninResponse>;
