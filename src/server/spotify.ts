import { env } from './env';

type TokenCache = { accessToken: string; expiresAtMs: number };

let tokenCache: TokenCache | null = null;

function spotifyConfigured(): boolean {
    return Boolean(
        env.SPOTIFY_CLIENT_ID?.trim() &&
            env.SPOTIFY_CLIENT_SECRET?.trim() &&
            env.SPOTIFY_REFRESH_TOKEN?.trim(),
    );
}

async function getAccessToken(): Promise<string | null> {
    if (!spotifyConfigured()) return null;

    const now = Date.now();
    if (
        tokenCache &&
        now < tokenCache.expiresAtMs - 60_000
    ) {
        return tokenCache.accessToken;
    }

    const refresh = env.SPOTIFY_REFRESH_TOKEN?.trim();
    const clientId = env.SPOTIFY_CLIENT_ID?.trim();
    const clientSecret = env.SPOTIFY_CLIENT_SECRET?.trim();
    if (!refresh || !clientId || !clientSecret) return null;

    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh,
    });

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
    );

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basic}`,
        },
        body,
    });

    if (!res.ok) {
        console.error('[spotify] token refresh failed', res.status);
        return null;
    }

    const data = (await res.json()) as {
        access_token: string;
        expires_in: number;
    };

    tokenCache = {
        accessToken: data.access_token,
        expiresAtMs: now + data.expires_in * 1000,
    };

    return tokenCache.accessToken;
}

export type SpotifyNowPlayingTrack = {
    id: string;
    name: string;
    artistLine: string;
    albumArtUrl: string;
    trackUrl: string;
};

/**
 * Current playback from Spotify Web API.
 * @see https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
 */
export async function getSpotifyNowPlaying(): Promise<
    SpotifyNowPlayingTrack | null
> {
    if (!spotifyConfigured()) return null;

    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const res = await fetch(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );

    if (res.status === 204 || res.status === 401) {
        return null;
    }

    if (!res.ok) {
        console.error('[spotify] currently-playing failed', res.status);
        return null;
    }

    const payload = (await res.json()) as {
        is_playing?: boolean;
        item?: {
            id?: string;
            type?: string;
            name?: string;
            artists?: { name?: string }[];
            external_urls?: { spotify?: string };
            album?: { images?: { url?: string }[] };
        };
    };

    if (payload.is_playing === false) {
        return null;
    }

    const item = payload.item;
    if (!item || item.type !== 'track' || !item.id) {
        return null;
    }

    const images = item.album?.images ?? [];
    const albumArtUrl =
        images[0]?.url ??
        images[images.length - 1]?.url ??
        '';

    if (!albumArtUrl) {
        return null;
    }

    const artistLine = (item.artists ?? [])
        .map((a) => a.name)
        .filter(Boolean)
        .join(', ');

    const trackUrl =
        item.external_urls?.spotify ??
        `https://open.spotify.com/track/${item.id}`;

    return {
        id: item.id,
        name: item.name ?? 'Unknown track',
        artistLine,
        albumArtUrl,
        trackUrl,
    };
}

export { spotifyConfigured };
