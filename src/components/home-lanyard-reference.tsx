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
    const isListening = lanyard?.spotify && lanyard.spotify.album_art_url;

    return (
        <motion.div variants={itemVariants} className="col-span-6 md:col-span-2">
            <CardHoverEffect className="h-full">
                <Link
                    href={
                        isListening
                            ? `https://open.spotify.com/track/${lanyard.spotify?.track_id}`
                            : 'https://open.spotify.com/playlist/15bl4PuutD4aS2GVsJGUk9'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-full min-h-[200px] overflow-hidden rounded-3xl"
                >
                    <div className="absolute inset-0">
                        {isListening && lanyard.spotify?.album_art_url ? (
                            <motion.img
                                src={lanyard.spotify.album_art_url}
                                alt=""
                                className="h-full w-full object-cover"
                                initial={{ scale: 1.1 }}
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.6 }}
                            />
                        ) : (
                            <img
                                src="https://i.scdn.co/image/ab67706c0000da84a15b50aca103257f2c7f4797"
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                        <div className="flex items-center justify-between">
                            <SiSpotify className="h-6 w-6" />
                            <FiArrowUpRight className="h-5 w-5 opacity-50 transition-opacity group-hover:opacity-100" />
                        </div>

                        <div>
                            {isListening ? (
                                <>
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
                                        {lanyard.spotify?.song}
                                    </h3>
                                    <p
                                        className="mt-0.5 line-clamp-1 text-sm text-white/70"
                                        suppressHydrationWarning
                                    >
                                        {formatList(
                                            lanyard.spotify?.artist?.split('; ') || [],
                                            'conjunction',
                                        )}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs font-medium text-white/60">Playlist</span>
                                    <h3 className="mt-1 text-lg font-semibold">bedtime dnb</h3>
                                    <p className="mt-0.5 text-sm text-white/70">
                                        Drum and bass to send you to sleep
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </Link>
            </CardHoverEffect>
        </motion.div>
    );
}
