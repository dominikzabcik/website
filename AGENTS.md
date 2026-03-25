# Agent memory

## Learned User Preferences

- “Temporarily disable” means keep code commented or in a non-route reference module for reuse, not only delete behavior.
- Prefer executing fixes in-repo (install, build, API wiring) over giving the user a list of commands when something is broken.
- For homepage cards, an asymmetric bento-style layout is acceptable when rhythm stays intentional; uniform all-equal rows are not required.
- Map hero imagery should read as clean and high-quality; single-tile default OSM stretched large is not an acceptable long-term look—prefer real MapKit, Mapbox static, or a cleaner basemap with proper attribution.
- README and similar footers: keep copyright year aligned with the current calendar year when touched.
- Communication: use full markdown links and proper code citation fences when referencing files.

## Learned Workspace Facts

- Personal site: Next.js Pages Router, Bun, Tailwind, Framer Motion; fork lineage from `alii/website`, personalized for Dominik (Prague, NFCtron). Spotify “now playing” uses the Web API (`/api/spotify-now-playing` + `SPOTIFY_*` env vars).
- Environment: `src/server/env.ts` uses Zod with defaults on Apple/Discord/Turnstile so `next build` and SSG do not fail when dashboard secrets are missing; optional Mapbox and `KV_REST_*`; `isDiscordWebhookConfigured` / `isTurnstileSecretConfigured` reflect whether real values exist in `process.env`. Optional vars are documented in `.env.example`.
- KV on Vercel is often added as Upstash Redis from the Storage marketplace; it may not appear as a product literally named KV, and it supplies env vars such as `KV_REST_API_URL` and `KV_REST_API_TOKEN` (plus related Redis/KV URLs and tokens). The same KV is used for last-visitor and a short-lived shared cache of Spotify “now playing” so every visitor does not hit Spotify’s API.
- Static map pipeline: Apple MapKit snapshot when `APPLE_PRIV_KEY` looks like a real PEM; else Mapbox light static via `/api/map-proxy` if `MAPBOX_ACCESS_TOKEN` is set; else Carto Voyager tiles. The `staticmap.openstreetmap.de` service is treated as unreliable.
- `alistair/hooks` usage was replaced with a local `use-local-storage` implementation where needed.
- Next.js `next/font` Newsreader: use compatible weights/styles and `adjustFontFallback: false` (or equivalent) to avoid “Failed to find font override values” build issues.
- MapKit signing is skipped or falls back when keys are placeholders to avoid OpenSSL decoder errors during local builds.
- Last-visitor geography uses `POST /api/last-visitor`, Vercel geo headers, and `@vercel/kv` when `KV_REST_API_URL` / `KV_REST_API_TOKEN` are configured.
- `.gitignore` excludes `*.tsbuildinfo` and `.cursor/` so TypeScript cache and Cursor local state stay out of version control.
- Do not place non-page reference components under `src/pages/`—Next.js will treat them as routes; use `src/components/` or similar instead.
