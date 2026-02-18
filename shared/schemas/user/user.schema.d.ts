import { z } from "zod";
export declare const SUser: z.ZodObject<{
    uuid: z.ZodUUID;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
    }>;
    email: z.ZodEmail;
    created_at: z.ZodDate;
    updated_at: z.ZodDate;
}, z.core.$strip>;
export type TUser = z.infer<typeof SUser>;
export declare const SUserPublic: z.ZodObject<{
    uuid: z.ZodUUID;
    email: z.ZodEmail;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
    }>;
    created_at: z.ZodDate;
}, z.core.$strip>;
export type TUserPublic = z.infer<typeof SUserPublic>;
export declare const SUserUpdate: z.ZodObject<{
    email: z.ZodOptional<z.ZodEmail>;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
    }>>;
}, z.core.$strip>;
export type TUserUpdate = z.infer<typeof SUserUpdate>;
