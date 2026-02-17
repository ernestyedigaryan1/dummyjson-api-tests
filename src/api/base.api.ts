import type { APIRequestContext, APIResponse } from '@playwright/test';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    query?: QueryParams;
    headers?: Record<string, string>;
    data?: unknown;
}

export abstract class BaseApi {
    protected readonly request: APIRequestContext;
    protected readonly baseUrl: string;

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    protected buildUrl(path: string, query?: QueryParams): string {
        const url = new URL(path.replace(/^\//, ''), this.baseUrl + '/');

        if (query) {
            for (const [key, value] of Object.entries(query)) {
                if (value === undefined || value === null) continue;
                url.searchParams.set(key, String(value));
            }
        }

        return url.toString();
    }

    protected async requestRaw(
        method: HttpMethod,
        path: string,
        options: RequestOptions = {},
    ): Promise<APIResponse> {
        const url = this.buildUrl(path, options.query);

        const response = await this.request.fetch(url, {
            method,
            headers: options.headers,
            data: options.data,
        });

        await this.ensureOk(response, method, url);
        return response;
    }

    protected async requestJson<T>(
        method: HttpMethod,
        path: string,
        options: RequestOptions = {},
    ): Promise<T> {
        const response = await this.requestRaw(method, path, options);
        return this.parseJsonOrEmpty<T>(response, method, this.buildUrl(path, options.query));
    }

    protected async parseJsonOrEmpty<T>(
        response: APIResponse,
        method: string,
        url: string,
    ): Promise<T> {
        if (response.status() === 204) return undefined as T;

        const text = (await response.text()).trim();
        if (!text) return undefined as T;

        try {
            return JSON.parse(text) as T;
        } catch {
            const contentType = response.headers()['content-type'] ?? '';
            throw new Error(
                `${method} ${url} expected JSON but got non-JSON body. ` +
                    `status=${response.status()} content-type="${contentType}" body="${text.slice(0, 300)}"`,
            );
        }
    }

    protected async get<T = unknown>(
        path: string,
        query?: QueryParams,
        headers?: Record<string, string>,
    ): Promise<T> {
        return this.requestJson<T>('GET', path, { query, headers });
    }

    protected async post<T = unknown>(
        path: string,
        data?: unknown,
        query?: QueryParams,
        headers?: Record<string, string>,
    ): Promise<T> {
        return this.requestJson<T>('POST', path, { data, query, headers });
    }

    protected async put<T = unknown>(
        path: string,
        data?: unknown,
        query?: QueryParams,
        headers?: Record<string, string>,
    ): Promise<T> {
        return this.requestJson<T>('PUT', path, { data, query, headers });
    }

    protected async patch<T = unknown>(
        path: string,
        data?: unknown,
        query?: QueryParams,
        headers?: Record<string, string>,
    ): Promise<T> {
        return this.requestJson<T>('PATCH', path, { data, query, headers });
    }

    protected async delete<T = unknown>(
        path: string,
        query?: QueryParams,
        headers?: Record<string, string>,
    ): Promise<T> {
        return this.requestJson<T>('DELETE', path, { query, headers });
    }

    protected async ensureOk(response: APIResponse, method: string, url: string) {
        if (response.ok()) return;

        const contentType = response.headers()['content-type'] ?? '';
        const text = await response.text().catch(() => '<no body>');

        throw new Error(
            `API ${method} ${url} failed: ${response.status()} content-type="${contentType}" body="${text.slice(0, 800)}"`,
        );
    }
}
