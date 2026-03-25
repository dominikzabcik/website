import { z } from 'zod';

export const env = z
    .object({
        APPLE_TEAM_ID: z.string(),
        APPLE_KEY_ID: z.string(),
        APPLE_PRIV_KEY: z.string(),
        DISCORD_WEBHOOK: z.string().url(),
        TURNSTILE_SECRET_KEY: z.string(),
        APP_URL: z
            .string()
            .default('http://localhost:3000')
            .pipe(z.string().url()),
        DEFAULT_LOCATION: z.string().default('London'),
        JWT_SIGNING_SECRET: z.string(),
        /** Optional — Mapbox Static Images for a clean “Apple-like” map when MapKit isn’t configured. */
        MAPBOX_ACCESS_TOKEN: z.string().optional(),
    })
    .parse(process.env);
