import { z } from 'zod';

/**
 * Defaults keep `next build` / SSG working when Dashboard env vars are missing
 * (e.g. first deploy, preview). Features that need real secrets check the
 * `is*` flags or validate at runtime.
 */
export const env = z
    .object({
        APPLE_TEAM_ID: z.string().default(''),
        APPLE_KEY_ID: z.string().default(''),
        APPLE_PRIV_KEY: z.string().default(''),
        DISCORD_WEBHOOK: z.preprocess(
            (v) =>
                typeof v === 'string' && v.trim().length > 0
                    ? v
                    : 'https://example.com/',
            z.string().url(),
        ),
        TURNSTILE_SECRET_KEY: z.string().default(''),
        /** Optional — Mapbox Static Images for a clean “Apple-like” map when MapKit isn’t configured. */
        MAPBOX_ACCESS_TOKEN: z.string().optional(),
        /** Optional — Vercel KV (`@vercel/kv` reads these from `process.env`). */
        KV_REST_API_URL: z.string().optional(),
        KV_REST_API_TOKEN: z.string().optional(),
    })
    .parse(process.env);

export const isDiscordWebhookConfigured = Boolean(
    process.env.DISCORD_WEBHOOK?.trim(),
);

export const isTurnstileSecretConfigured = Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim(),
);
