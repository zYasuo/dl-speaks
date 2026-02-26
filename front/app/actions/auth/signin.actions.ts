"use server";

import { cookies } from "next/headers";
import { API_ROUTES, AUTH_TOKEN_COOKIE_NAME } from "@/app/config/api/api-config";
import { getApiRequestInit } from "@/app/config/api/api-client";
import type { IActionResponse } from "@/app/types/api/api.types";
import type { TSignin, TSigninResponse } from "@shared/schemas/auth/signin.schema";
import type { TUserPublic } from "@shared/schemas/user/user.schema";

const emptyUser: TUserPublic = {
    uuid: "",
    email: "",
    role: "USER",
    created_at: new Date(0),
};

export async function signin(form_data: TSignin): Promise<IActionResponse<TSigninResponse>> {
    try {
        const route = API_ROUTES.AUTH.SIGNIN;
        const { url, init } = getApiRequestInit(route, {
            body: form_data,
        });

        const response = await fetch(url, init);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const message = typeof error?.message === "string" ? error.message : "Sign in failed";
            return {
                success: false,
                message: "Sign in failed",
                data: { user: emptyUser, access_token: "", token_type: "Bearer" },
                error: message,
            };
        }

        const payload: TSigninResponse = await response.json();

        if (payload.access_token) {
            const cookieStore = await cookies();
            cookieStore.set(AUTH_TOKEN_COOKIE_NAME, payload.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
        }

        return {
            success: true,
            message: "Signed in successfully",
            data: {
                user: payload.user,
                access_token: payload.access_token,
                token_type: payload.token_type ?? "Bearer",
            },
        };
    } catch (error) {
        return {
            success: false,
            message: "Sign in failed",
            data: { user: emptyUser, access_token: "", token_type: "Bearer" },
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
