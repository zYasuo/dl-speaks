export const API_BASE_URL = process.env.BACKEND_URL;

export const API_ROUTES = {
    AUTH: {
        SIGNIN: {
            url: "/auth/signin",
            method: "POST" as const,
            requires_auth: false,
        },
        SIGNUP: {
            url: "/auth/signup",
            method: "POST" as const,
            requires_auth: false,
        },
    },
    USER: {
        PROFILE: {
            url: "/users/profile",
            method: "GET" as const,
            requires_auth: true,
        },
    },
    DICTIONARY: {
        GET_WORDS: {
            url: "/dictionary/:language/:word",
            method: "GET" as const,
            requires_auth: false,
        },
        GET_RECENT_WORDS: {
            url: "/words/recent",
            method: "GET" as const,
            requires_auth: false,
        },
        ADD_TO_FAVORITE: {
            url: "/words/favorite",
            method: "POST" as const,
            requires_auth: true,
        },
    },
} as const;

export const AUTH_TOKEN_COOKIE_NAME = "access_token";

export const API_BASE_HEADERS: HeadersInit = {
    "Content-Type": "application/json",
};
