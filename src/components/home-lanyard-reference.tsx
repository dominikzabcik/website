/**
 * TEMPORARILY DISABLED — Discord + Spotify (Lanyard) sections
 * =============================================================
 * This file is not imported; it keeps the full JSX + helpers so you can
 * copy them back into `src/pages/index.tsx` when re-enabling.
 *
 * Steps to re-enable:
 * 1. In `src/utils/constants.ts` — uncomment `discordId`.
 * 2. In `index.tsx` — uncomment the imports marked "Lanyard" in the block below.
 * 3. Add `lanyard` to `Props`, fetch in `getStaticProps`, and wire `useLanyardWS` in `Home`.
 * 4. Paste `StatusBadge` + Discord block (after LinkedIn; shrink Time to `col-span-3 md:col-span-2`).
 * 5. Set GitHub to `col-span-6 md:col-span-2`, paste Spotify block after GitHub.
 */

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { SiSpotify } from 'react-icons/si';
import { CardHoverEffect } from './hover-card';
import type { Types as LanyardTypes } from 'use-lanyard';
import { formatList } from '../utils/lists';

export function StatusBadge({ status }: { status: string }) {
    const colors = {
        online: 'from-emerald-500 to-teal-500',
        idle: 'from-amber-500 to-orange-500',
        dnd: 'from-rose-500 to-red-500',
        offline: 'from-slate-500 to-zinc-500',
    };

    const labels = {
        online: 'Online',
        idle: 'Idle',
        dnd: 'Busy',
        offline: 'Offline',
    };

    return (
        <div
            className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${colors[status as keyof typeof colors] || colors.offline} px-4 py-2 text-white shadow-lg`}
        >
            <span className="relative flex h-2.5 w-2.5">
                <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${status === 'online' ? 'bg-white' : 'bg-white/50'}`}
                />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <span className="text-sm font-medium">
                {labels[status as keyof typeof labels] || 'Offline'}
            </span>
        </div>
    );
}

/** Pass `lanyard` from useLanyardWS + itemVariants */
export function DiscordStatusCard(props: {
    itemVariants: Variants;
    lanyard: LanyardTypes.Presence;
}) {
    const { itemVariants, lanyard } = props;
    const status = lanyard.discord_status ?? 'offline';

    return (
        <motion.div variants={itemVariants} className="col-span-3 md:col-span-2">
            <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-4 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                <StatusBadge status={status} />
                <div className="text-center">
                    <p className="text-sm opacity-80">@{lanyard.discord_user.username}</p>
                </div>
            </div>
        </motion.div>
    );
}

/** Pass `lanyard`, `isListening`, `itemVariants` */
export function SpotifyCard(props: {
    itemVariants: Variants;
    lanyard: LanyardTypes.Presence;
}) {
    const { itemVariants, lanyard } = props;
    const spotify = lanyard.spotify;
    if (
        !spotify?.track_id ||
        !spotify.album_art_url ||
        spotify.album_art_url.length === 0
    ) {
        return null;
    }

    const { track_id, album_art_url, song, artist } = spotify;

    return (
        <motion.div variants={itemVariants} className="col-span-6 md:col-span-2">
            <CardHoverEffect className="h-full">
                <Link
                    href={`https://open.spotify.com/track/${track_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-full min-h-[200px] overflow-hidden rounded-3xl"
                >
                    <div className="absolute inset-0">
                        <motion.img
                            src={album_art_url}
                            alt=""
                            className="h-full w-full object-cover"
                            initial={{ scale: 1.1 }}
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                        <div className="flex items-center justify-between">
                            <SiSpotify className="h-6 w-6" />
                            <FiArrowUpRight className="h-5 w-5 opacity-50 transition-opacity group-hover:opacity-100" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">
                                    Now Playing
                                </span>
                            </div>
                            <h3
                                className="mt-2 line-clamp-1 text-lg font-semibold"
                                suppressHydrationWarning
                            >
                                {song}
                            </h3>
                            <p
                                className="mt-0.5 line-clamp-1 text-sm text-white/70"
                                suppressHydrationWarning
                            >
                                {formatList(
                                    artist?.split('; ') || [],
                                    'conjunction',
                                )}
                            </p>
                        </div>
                    </div>
                </Link>
            </CardHoverEffect>
        </motion.div>
    );
}
