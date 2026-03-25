import type { NextApiRequest, NextApiResponse } from 'next';
import { getKv, isKvConfigured } from '../../server/kv';
import type { LastVisitorApiResponse, LastVisitorRecord } from '../../types/last-visitor';

const KV_KEY = 'site:last_visitor';

function countryNameFromCode(code: string): string {
    if (!code || code === 'XX') return 'Unknown';
    try {
        const names = new Intl.DisplayNames(['en'], { type: 'region' });
        return names.of(code) ?? code;
    } catch {
        return code;
    }
}

function parseGeoFromRequest(req: NextApiRequest): LastVisitorRecord {
    const rawCc = req.headers['x-vercel-ip-country'];
    const countryCode =
        typeof rawCc === 'string' && rawCc.length >= 2
            ? rawCc.slice(0, 2).toUpperCase()
            : 'XX';

    const rawCity = req.headers['x-vercel-ip-city'];
    const city =
        typeof rawCity === 'string' && rawCity.length > 0
            ? decodeURIComponent(rawCity.replace(/\+/g, ' '))
            : undefined;

    const rawRegion = req.headers['x-vercel-ip-country-region'];
    const region =
        typeof rawRegion === 'string' && rawRegion.length > 0
            ? rawRegion
            : undefined;

    const countryName = countryNameFromCode(countryCode);

    const record: LastVisitorRecord = {
        countryCode,
        countryName,
        recordedAt: Date.now(),
    };
    if (city && city !== 'undefined') {
        record.city = city;
    }
    if (region) {
        record.region = region;
    }
    return record;
}

/**
 * Records this request’s approximate geo (Vercel headers) and returns the **previous**
 * visitor’s record. Requires Vercel KV (`KV_*` env) in production.
 *
 * @see https://vercel.com/docs/edge-network/headers#x-vercel-ip-country
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LastVisitorApiResponse>,
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end();
    }

    if (!isKvConfigured()) {
        return res.status(200).json({ enabled: false, previous: null });
    }

    const kv = getKv();
    if (!kv) {
        return res.status(200).json({ enabled: false, previous: null });
    }

    const current = parseGeoFromRequest(req);

    try {
        const rawPrevious = await kv.get<string | LastVisitorRecord>(KV_KEY);
        let previous: LastVisitorRecord | null = null;
        if (rawPrevious != null) {
            previous =
                typeof rawPrevious === 'string'
                    ? (JSON.parse(rawPrevious) as LastVisitorRecord)
                    : rawPrevious;
        }

        await kv.set(KV_KEY, current);

        return res.status(200).json({ enabled: true, previous });
    } catch (e) {
        console.error('[last-visitor]', e);
        return res.status(200).json({ enabled: false, previous: null });
    }
}
