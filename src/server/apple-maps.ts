import jwa from 'jwa';
import { env } from './env';

const es256 = jwa('ES256');

/** Prague center for MapKit `center` and raster fallbacks (WGS84). */
const PRAGUE = { lat: 50.0755, lon: 14.4378 };

/** Carto Voyager tile zoom — slightly higher for sharper streets in the card. */
const CARTO_FALLBACK_ZOOM = 14;

/**
 * Heuristic: only attempt ES256 signing when the env looks like a real PKCS#8 PEM.
 * Avoids OpenSSL "DECODER routines::unsupported" on placeholders and noisy dev logs.
 */
function isLikelyValidMapKitPrivateKey(pem: string): boolean {
    const s = pem.trim();
    if (s.length < 100) return false;
    const hasPemFrame =
        (s.includes('BEGIN PRIVATE KEY') && s.includes('END PRIVATE KEY')) ||
        (s.includes('BEGIN EC PRIVATE KEY') && s.includes('END EC PRIVATE KEY'));
    if (!hasPemFrame) return false;
    if (/REPLACE|placeholder|your_|example|localdev|dummy/i.test(s)) return false;
    return true;
}

/**
 * WGS84 → OSM slippy map tile indices (Web Mercator).
 * @see https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
 */
export function latLonToTile(
    lat: number,
    lon: number,
    zoom: number,
): { x: number; y: number; z: number } {
    const z = zoom;
    const n = 2 ** z;
    const x = Math.floor(((lon + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const y = Math.floor(
        ((1 -
            Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
            2) *
            n,
    );
    return { x, y, z };
}

/**
 * Carto Voyager — cleaner typography and palette than raw OSM tiles (still OSM data).
 * @see https://carto.com/basemaps/
 */
function cartoVoyagerTileUrl(lat: number, lon: number, zoom: number): string {
    const { x, y, z } = latLonToTile(lat, lon, zoom);
    return `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`;
}

export type MapImageSource = 'apple' | 'mapbox' | 'carto';

export interface MapImageResult {
    url: string;
    source: MapImageSource;
}

/**
 * Map priority:
 * 1. Apple MapKit snapshot (true Apple imagery) when credentials sign correctly.
 * 2. Mapbox Light (`light-v11`) via `/api/map-proxy` — minimal, high-res static image (token stays server-side).
 * 3. Carto Voyager raster tile — nicer than default OSM tiles when Mapbox isn’t set.
 */
export function getMapImage(_center: string): MapImageResult {
    if (!isLikelyValidMapKitPrivateKey(env.APPLE_PRIV_KEY)) {
        if (env.MAPBOX_ACCESS_TOKEN?.trim()) {
            return { url: '/api/map-proxy', source: 'mapbox' };
        }
        return {
            url: cartoVoyagerTileUrl(
                PRAGUE.lat,
                PRAGUE.lon,
                CARTO_FALLBACK_ZOOM,
            ),
            source: 'carto',
        };
    }

    try {
        const params = new URLSearchParams({
            center: _center,
            teamId: env.APPLE_TEAM_ID,
            keyId: env.APPLE_KEY_ID,
            z: '13',
            colorScheme: 'dark',
            size: '340x200',
            scale: '2',
            t: 'mutedStandard',
            poi: '0',
        });

        const completePath = `/api/v1/snapshot?${params.toString()}`;
        const signature = es256.sign(completePath, env.APPLE_PRIV_KEY);

        return {
            url: `https://snapshot.apple-mapkit.com${completePath}&signature=${signature}`,
            source: 'apple',
        };
    } catch {
        if (env.MAPBOX_ACCESS_TOKEN?.trim()) {
            return { url: '/api/map-proxy', source: 'mapbox' };
        }
        return {
            url: cartoVoyagerTileUrl(
                PRAGUE.lat,
                PRAGUE.lon,
                CARTO_FALLBACK_ZOOM,
            ),
            source: 'carto',
        };
    }
}
