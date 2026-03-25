import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpotifyNowPlayingPublic } from '../../server/spotify-public';
import type { SpotifyNowPlayingApiResponse } from '../../types/spotify-now-playing';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SpotifyNowPlayingApiResponse>,
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).end();
    }

    const payload = await getSpotifyNowPlayingPublic();

    // Avoid stale browser/CDN caches on this API — each client polls; KV dedupes Spotify.
    res.setHeader(
        'Cache-Control',
        'private, no-store, must-revalidate',
    );

    return res.status(200).json(payload);
}
