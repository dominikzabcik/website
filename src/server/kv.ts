import { createClient, type VercelKV } from '@vercel/kv';

/**
 * Vercel Storage “KV” and Upstash Redis both use `@vercel/kv` / Upstash REST.
 * The dashboard may expose either naming:
 * - `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel KV / linked KV)
 * - `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (Redis / Upstash integration)
 */
function resolveKvCredentials(): { url: string; token: string } | null {
    const url =
        process.env.KV_REST_API_URL?.trim() ||
        process.env.UPSTASH_REDIS_REST_URL?.trim();
    const token =
        process.env.KV_REST_API_TOKEN?.trim() ||
        process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
    if (!url || !token) {
        return null;
    }
    return { url, token };
}

let _kv: VercelKV | null | undefined;

/** True when any supported URL + token pair is present on `process.env`. */
export function isKvConfigured(): boolean {
    return resolveKvCredentials() !== null;
}

/**
 * Singleton REST client. Returns `null` when credentials are missing (same as
 * “KV not linked” for feature flags).
 */
export function getKv(): VercelKV | null {
    if (_kv !== undefined) {
        return _kv;
    }
    const creds = resolveKvCredentials();
    if (!creds) {
        _kv = null;
        return null;
    }
    _kv = createClient({
        url: creds.url,
        token: creds.token,
        cache: 'default',
        enableAutoPipelining: true,
    });
    return _kv;
}
