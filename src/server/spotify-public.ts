import { getKv, isKvConfigured } from './kv';
import { getSpotifyNowPlaying, spotifyConfigured } from './spotify';
import type { SpotifyNowPlayingApiResponse } from '../types/spotify-now-playing';

const KV_KEY = 'site:spotify_now_playing';

/** Shared snapshot for all visitors; refreshed from Spotify only when TTL expires. */
const TTL_PLAYING_SEC = 20;
const TTL_IDLE_SEC = 40;

/**
 * Public “now playing” payload: one cached answer for everyone (KV), so Spotify’s
 * API isn’t hit once per browser poll.
 */
export async function getSpotifyNowPlayingPublic(): Promise<SpotifyNowPlayingApiResponse> {
    if (!spotifyConfigured()) {
        return { configured: false };
    }

    if (isKvConfigured()) {
        const kv = getKv();
        if (kv) {
            try {
                const raw = await kv.get<string>(KV_KEY);
                if (raw != null && raw.length > 0) {
                    const parsed = JSON.parse(raw) as SpotifyNowPlayingApiResponse;
                    if (
                        parsed &&
                        typeof parsed === 'object' &&
                        'configured' in parsed &&
                        parsed.configured === true
                    ) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.error('[spotify-public] kv get', e);
            }
        }
    }

    const track = await getSpotifyNowPlaying();

    if (!track) {
        const response: SpotifyNowPlayingApiResponse = {
            configured: true,
            playing: false,
        };
        await persistKv(response, TTL_IDLE_SEC);
        return response;
    }

    const response: SpotifyNowPlayingApiResponse = {
        configured: true,
        playing: true,
        track,
    };
    await persistKv(response, TTL_PLAYING_SEC);
    return response;
}

async function persistKv(
    response: SpotifyNowPlayingApiResponse,
    ttlSec: number,
): Promise<void> {
    if (!isKvConfigured()) {
        return;
    }
    const kv = getKv();
    if (!kv) {
        return;
    }
    try {
        await kv.set(KV_KEY, JSON.stringify(response), { ex: ttlSec });
    } catch (e) {
        console.error('[spotify-public] kv set', e);
    }
}
