"use server";

import { cookies } from "next/headers";
import { API_ROUTES } from "@/app/config/api/api-config";
import { AUTH_TOKEN_COOKIE_NAME } from "@/app/config/api/api-config";
import { getApiRequestInit } from "@/app/config/api/api-client";
import type { IActionResponse } from "@/app/types/api/api.types";
import { IUser } from "@/app/types/user/user.types";
import type { TAuthProfile } from "@/app/types/auth/auth.types";

const emptyProfile: IUser = {
    uuid: "",
    email: "",
    created_at: "",
    updated_at: "",
    role: "",
};

export async function profile(): Promise<IActionResponse<TAuthProfile>> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value ?? null;

    const route = API_ROUTES.USER.PROFILE;
    const { url, init } = getApiRequestInit(route, { token });
    const response = await fetch(url, init);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
            success: false,
            message: "Profile failed",
            data: emptyProfile,
        };
    }

    const data: TAuthProfile = await response.json();
    return {
        success: true,
        message: "Profile successful",
        data,
    };
}
