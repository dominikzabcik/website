/** Stored in Vercel KV + returned to the client (no raw IP). */
export type LastVisitorRecord = {
    countryCode: string;
    countryName: string;
    city?: string;
    region?: string;
    recordedAt: number;
};

export type LastVisitorApiResponse =
    | {
          enabled: true;
          previous: LastVisitorRecord | null;
      }
    | {
          enabled: false;
          previous: null;
      };

/** sessionStorage keys — one ping per browser tab session */
export const LAST_VISITOR_SESSION = {
    ping: 'site:visitor_ping_v2',
    preview: 'site:last_visitor_preview',
    kvEnabled: 'site:visitor_kv_enabled',
} as const;
