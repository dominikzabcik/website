'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiEye,
    FiGlobe,
    FiRefreshCw,
} from 'react-icons/fi';
import { useLastVisitor } from './last-visitor-provider';
import { useFirstEverLoad, useVisitCounts } from '../hooks/use-first-ever-load';

function formatLastVisitorLocation(p: {
    city?: string;
    countryName: string;
    region?: string;
}): string {
    const place = [p.city, p.region].filter(Boolean).join(', ');
    return place ? `${place} · ${p.countryName}` : p.countryName;
}

export function Stats() {
    const [stats] = useFirstEverLoad();
    const [visits] = useVisitCounts();
    const lastVisitor = useLastVisitor();

    const firstEverLoadTime = new Date(stats.time);
    const isReturning = visits > 1;

    const statItems = [
        {
            icon: FiCalendar,
            label: 'First visit date',
            value: firstEverLoadTime.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        },
        {
            icon: FiClock,
            label: 'First visit time',
            value: firstEverLoadTime.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        },
        {
            icon: FiEye,
            label: 'First page',
            value: stats.path,
        },
        {
            icon: FiRefreshCw,
            label: 'Return visits',
            value: visits - 1,
        },
    ];

    return (
        <div className="relative min-h-screen px-4 py-16">
            {/* Background */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute -right-[20%] -top-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/5 blur-3xl" />
                <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/5 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Back link */}
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        Back home
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-light tracking-tight">Your Stats</h1>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                            {isReturning 
                                ? 'Thanks for coming back! Here is your visit history.'
                                : 'Welcome! This is your first visit.'
                            }
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4">
                        {statItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="flex items-center gap-4 rounded-2xl bg-white/80 p-5 backdrop-blur-sm dark:bg-neutral-900/80"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                                    <item.icon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.label}</p>
                                    <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}

                        {lastVisitor.ready && lastVisitor.enabled && lastVisitor.previous && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: statItems.length * 0.1, duration: 0.5 }}
                                className="flex items-center gap-4 rounded-2xl bg-white/80 p-5 backdrop-blur-sm dark:bg-neutral-900/80"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                                    <FiGlobe className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Last visitor was from
                                    </p>
                                    <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                        {formatLastVisitorLocation(lastVisitor.previous)}
                                    </p>
                                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                                        Approximate location (IP · Vercel)
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {lastVisitor.ready && lastVisitor.enabled && !lastVisitor.previous && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: statItems.length * 0.1, duration: 0.5 }}
                                className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-5 dark:border-neutral-700 dark:bg-neutral-900/50"
                            >
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    You&apos;re the first visitor we&apos;ve logged in this deployment — come back
                                    later to see where the last guest was from.
                                </p>
                            </motion.div>
                        )}

                        {lastVisitor.ready && !lastVisitor.enabled && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: statItems.length * 0.1, duration: 0.5 }}
                                className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400"
                            >
                                Last-visitor geography runs when{' '}
                                <strong className="font-medium text-neutral-800 dark:text-neutral-200">
                                    Vercel KV
                                </strong>{' '}
                                is linked and{' '}
                                <code className="rounded bg-neutral-200/80 px-1 dark:bg-neutral-800">
                                    KV_REST_API_URL
                                </code>{' '}
                                /{' '}
                                <code className="rounded bg-neutral-200/80 px-1 dark:bg-neutral-800">
                                    KV_REST_API_TOKEN
                                </code>{' '}
                                are set (pull env with{' '}
                                <code className="rounded bg-neutral-200/80 px-1 dark:bg-neutral-800">
                                    vercel env pull
                                </code>
                                ).
                            </motion.div>
                        )}
                    </div>

                    {/* Fun message */}
                    {isReturning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white"
                        >
                            <p className="text-lg font-medium">
                                You&apos;ve visited {visits} times!
                            </p>
                            <p className="mt-1 text-white/80">
                                I appreciate you coming back to check out my work.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
