import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '../../server/env';

/** Match `getMapImage` Prague center. */
const PRAGUE = { lat: 50.0755, lon: 14.4378 };

/**
 * Proxies Mapbox Static Images so `MAPBOX_ACCESS_TOKEN` never appears in HTML.
 * Style `light-v11` is close to Apple Maps’ clean, muted road network look.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).end();
    }

    const token = env.MAPBOX_ACCESS_TOKEN?.trim();
    if (!token) {
        return res.status(404).end();
    }

    const { lon, lat } = PRAGUE;
    const mapboxUrl = new URL(
        `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${lon},${lat},13,0/900x520@2x`,
    );
    mapboxUrl.searchParams.set('access_token', token);

    try {
        const upstream = await fetch(mapboxUrl);
        if (!upstream.ok) {
            return res.status(502).end();
        }
        const buffer = Buffer.from(await upstream.arrayBuffer());
        const contentType =
            upstream.headers.get('content-type') ?? 'image/png';
        res.setHeader('Content-Type', contentType);
        res.setHeader(
            'Cache-Control',
            'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        );
        return res.status(200).send(buffer);
    } catch {
        return res.status(502).end();
    }
}
