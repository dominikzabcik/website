'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { SiSpotify } from 'react-icons/si';
import { useCallback, useEffect, useState } from 'react';
import { CardHoverEffect } from './hover-card';
import type { SpotifyNowPlayingApiResponse } from '../types/spotify-now-playing';

/** Matches server KV TTL (~20s); frequent enough to feel live without hammering Spotify. */
const POLL_MS = 12_000;

type NowPlayingTrack = Extract<
    SpotifyNowPlayingApiResponse,
    { playing: true }
>['track'];

export function SpotifyNowPlayingCard(props: { itemVariants: Variants }) {
    const { itemVariants } = props;
    const [track, setTrack] = useState<NowPlayingTrack | null>(null);
    const [ready, setReady] = useState(false);

    const fetchNowPlaying = useCallback(async () => {
        try {
            const res = await fetch('/api/spotify-now-playing', {
                cache: 'no-store',
            });
            const data = (await res.json()) as SpotifyNowPlayingApiResponse;
            if (!data.configured) {
                setTrack(null);
                return;
            }
            if (data.playing) {
                setTrack(data.track);
            } else {
                setTrack(null);
            }
        } catch {
            setTrack(null);
        } finally {
            setReady(true);
        }
    }, []);

    useEffect(() => {
        void fetchNowPlaying();
        const id = window.setInterval(() => void fetchNowPlaying(), POLL_MS);
        return () => window.clearInterval(id);
    }, [fetchNowPlaying]);

    if (!ready || !track) {
        return null;
    }

    return (
        <motion.div variants={itemVariants} className="col-span-6 md:col-span-2">
            <CardHoverEffect className="h-full">
                <Link
                    href={track.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block h-full min-h-[200px] w-full min-w-0 overflow-hidden rounded-3xl"
                >
                    <div className="absolute inset-0">
                        <motion.img
                            src={track.albumArtUrl}
                            alt=""
                            className="h-full w-full object-cover"
                            initial={{ scale: 1.1 }}
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                    </div>

                    <div className="relative z-10 flex h-full w-full min-w-0 flex-col justify-between p-6 text-white">
                        <div className="flex w-full shrink-0 items-center justify-between gap-3">
                            <SiSpotify className="h-6 w-6 shrink-0" />
                            <FiArrowUpRight className="h-5 w-5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
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
                                {track.name}
                            </h3>
                            <p
                                className="mt-0.5 line-clamp-1 text-sm text-white/70"
                                suppressHydrationWarning
                            >
                                {track.artistLine}
                            </p>
                        </div>
                    </div>
                </Link>
            </CardHoverEffect>
        </motion.div>
    );
}
