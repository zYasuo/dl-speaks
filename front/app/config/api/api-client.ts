import {
    API_BASE_HEADERS,
    API_BASE_URL,
    API_ROUTES,
} from "@/app/config/api/api-config";

export type ApiRoute = {
    url: string;
    method: string;
    requires_auth: boolean;
};

export interface ApiRequestOptions {
    token?: string | null;
    body?: Record<string, unknown>;
    pathParams?: Record<string, string>;
}

export function getApiUrl(route: ApiRoute, pathParams?: Record<string, string>): string {
    let url = `${API_BASE_URL}${route.url}`;
    if (pathParams) {
        Object.entries(pathParams).forEach(([key, value]) => {
            url = url.replace(`:${key}`, encodeURIComponent(value));
        });
    }
    return url;
}

export function getApiHeaders(route: ApiRoute, options: ApiRequestOptions = {}): HeadersInit {
    const headers: Record<string, string> = { ...API_BASE_HEADERS } as Record<string, string>;
    if (route.requires_auth && options.token) {
        headers["Authorization"] = `Bearer ${options.token}`;
    }
    return headers;
}

const bodyMethods = ["POST", "PUT", "PATCH"];

export function getApiRequestInit(
    route: ApiRoute,
    options: ApiRequestOptions = {}
): { url: string; init: RequestInit } {
    const url = getApiUrl(route, options.pathParams);
    const headers = getApiHeaders(route, options);
    const init: RequestInit = {
        method: route.method,
        headers,
    };
    if (options.body != null && bodyMethods.includes(route.method)) {
        init.body = JSON.stringify(options.body);
    }
    return { url, init };
}
