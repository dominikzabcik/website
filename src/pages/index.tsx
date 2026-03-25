'use client';

/**
 * Lanyard (Discord + Spotify) is temporarily disabled — nothing deleted.
 * Full components + layout notes: `src/components/home-lanyard-reference.tsx`
 * Uncomment `discordId` in `src/utils/constants.ts`, then wire imports / Props /
 * getStaticProps / useLanyardWS and paste the blocks from the reference file.
 *
 * --- Lanyard imports (uncomment when re-enabling) ---
 * import { useLanyardWS, type Types as LanyardTypes } from 'use-lanyard';
 * import { getLanyard } from '../server/lanyard';
 * import { discordId } from '../utils/constants';
 * import { SiSpotify } from 'react-icons/si';
 * import { DiscordStatusCard, SpotifyCard } from '../components/home-lanyard-reference';
 */

import { motion } from 'framer-motion';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { FiArrowUpRight, FiGithub, FiLinkedin } from 'react-icons/fi';
import {
    SiDocker,
    SiGo,
    SiNextdotjs,
    SiNodedotjs,
    SiPostgresql,
    SiReact,
    SiTailwindcss,
    SiTypescript,
} from 'react-icons/si';
import { AnimatedOrbs } from '../components/animated-background';
import { ContactForm } from '../components/contact-form';
import { CardHoverEffect } from '../components/hover-card';
import { Time } from '../components/time';
import matrix from '../images/matrix.gif';
import profilePhoto from '../images/dominik-profile.png';
import { getAge, location } from '../utils/constants';
import { getMapImage } from '../server/apple-maps';

export interface Props {
    location: string;
    map: string;
    mapSource: 'apple' | 'mapbox' | 'carto';
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    },
};

export const getStaticProps: GetStaticProps<Props> = async () => {
    const { url: map, source: mapSource } = getMapImage(location);

    return {
        revalidate: 10,
        props: {
            location,
            map,
            mapSource,
        },
    };
};

// Tech icon with hover effect
function TechIcon({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="group relative flex items-center justify-center"
            title={label}
        >
            <Icon className="h-6 w-6 transition-colors duration-300 group-hover:text-white" />
        </motion.div>
    );
}

export default function Home(props: Props) {
    return (
        <div className="relative min-h-screen">
            {/* Background Effects */}
            <AnimatedOrbs />
            
            <div className="relative z-10">
                <motion.main
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto grid max-w-5xl grid-cols-6 gap-4 px-4 pb-20 pt-24 md:gap-6 md:px-6"
                >
                    {/* Hero Card - Name & Title */}
                    <motion.div
                        variants={itemVariants}
                        className="col-span-6 md:col-span-4"
                    >
                        <CardHoverEffect className="h-full">
                            <div className="flex h-full min-h-[200px] flex-col justify-between rounded-3xl bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-100 p-8 dark:from-rose-950/50 dark:via-pink-900/30 dark:to-fuchsia-950/50">
                                <div className="flex items-start justify-between">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-sm font-medium backdrop-blur-sm dark:bg-black/30"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        CISO at NFCtron
                                    </motion.div>
                                    <Link
                                        href="https://nfctron.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-1 rounded-full bg-white/60 px-4 py-1.5 text-sm backdrop-blur-sm transition-colors hover:bg-white dark:bg-black/30 dark:hover:bg-black/50"
                                    >
                                        NFCtron
                                        <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </div>
                                
                                <div>
                                    <h1 className="text-4xl font-light tracking-tight md:text-5xl">
                                        Dominik Žabčík
                                    </h1>
                                    <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
                                        {getAge()}-year-old full stack TypeScript engineer
                                    </p>
                                </div>
                            </div>
                        </CardHoverEffect>
                    </motion.div>

                    {/* Social Links - LinkedIn (compact 2-col) */}
                    <motion.div variants={itemVariants} className="col-span-3 md:col-span-2">
                        <CardHoverEffect className="h-full">
                            <Link
                                href="https://www.linkedin.com/in/dominik-%C5%BEab%C4%8D%C3%ADk-a1857433a/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-full min-h-[100px] items-center justify-center rounded-3xl bg-[#0A66C2] text-white transition-colors hover:bg-[#005582]"
                            >
                                <FiLinkedin className="h-8 w-8" />
                            </Link>
                        </CardHoverEffect>
                    </motion.div>

                    {/* Row 2: Time (dominant 4-col) + GitHub (compact 2-col) */}
                    {/* Time & Birthday - takes visual priority */}
                    <motion.div variants={itemVariants} className="col-span-6 md:col-span-4">
                        <Time />
                    </motion.div>

                    {/* GitHub - compact vertical card */}
                    <motion.div variants={itemVariants} className="col-span-3 md:col-span-2">
                        <CardHoverEffect className="h-full">
                            <Link
                                href="https://github.com/dominikzabcik"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex h-full min-h-[160px] flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-neutral-900 p-4 text-white dark:bg-neutral-800"
                            >
                                <div className="absolute inset-0 opacity-30">
                                    <img
                                        src={matrix.src}
                                        alt=""
                                        className="h-full w-full object-cover brightness-75 invert dark:invert-0"
                                    />
                                </div>
                                <FiGithub className="relative z-10 h-10 w-10" />
                                <span className="relative z-10 text-sm font-medium">GitHub</span>
                            </Link>
                        </CardHoverEffect>
                    </motion.div>

                    {/* Row 3: Maps (dominant 4-col) + Tech Stack (compact 2-col sidebar) */}
                    {/* Apple Maps - Prague Location */}
                    <motion.div variants={itemVariants} className="col-span-6 md:col-span-4">
                        <CardHoverEffect className="h-full">
                            <div className="group relative flex h-full min-h-[240px] flex-shrink-0 overflow-hidden rounded-3xl">
                                <img
                                    src={props.map}
                                    className={
                                        props.mapSource === 'carto'
                                            ? 'absolute inset-0 h-full w-full scale-[1.12] bg-neutral-900 object-cover object-center transition-transform duration-700 [image-rendering:auto] group-hover:scale-[1.2]'
                                            : 'absolute inset-0 h-full w-full scale-105 bg-black object-cover object-center transition-transform duration-700 group-hover:scale-[1.12]'
                                    }
                                    alt="A map locating Prague, Czech Republic"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                                <div className="absolute left-1/2 top-1/2 z-10 flex w-full flex-shrink-0 -translate-x-1/2 -translate-y-1/2 flex-col items-center space-y-3">
                                    <div aria-hidden className="absolute translate-y-[18px]">
                                        <span className="block h-14 w-14 animate-ping rounded-full bg-lime-500 duration-1000" />
                                    </div>

                                    <img
                                        src={profilePhoto.src}
                                        alt="Dominik Žabčík — full stack TypeScript engineer"
                                        height={70}
                                        width={70}
                                        className="z-20 h-20 w-20 rounded-full border-3 border-white shadow-xl transition-transform duration-500 group-hover:-rotate-[10deg] group-hover:scale-110"
                                    />

                                    <p className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white/95 backdrop-blur-md">
                                        📍 Prague, Czech Republic
                                    </p>
                                </div>

                                {props.mapSource === 'mapbox' && (
                                    <a
                                        href="https://www.mapbox.com/about/maps/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute bottom-2 right-2 z-20 max-w-[min(100%,11rem)] rounded bg-black/45 px-1.5 py-0.5 text-[9px] leading-tight text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
                                    >
                                        © Mapbox © OpenStreetMap
                                    </a>
                                )}
                                {props.mapSource === 'carto' && (
                                    <a
                                        href="https://carto.com/legal/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute bottom-2 right-2 z-20 max-w-[min(100%,11rem)] rounded bg-black/45 px-1.5 py-0.5 text-[9px] leading-tight text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
                                    >
                                        © CARTO · © OpenStreetMap
                                    </a>
                                )}
                            </div>
                        </CardHoverEffect>
                    </motion.div>

                    {/* Tech Stack - vertical sidebar style */}
                    <motion.div variants={itemVariants} className="col-span-3 md:col-span-2">
                        <div className="flex h-full min-h-[240px] flex-col justify-between rounded-3xl bg-gradient-to-b from-violet-600 via-fuchsia-600 to-pink-600 p-5 text-white">
                            <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">Stack</h3>
                            <div className="flex flex-wrap content-end gap-3">
                                <TechIcon icon={SiTypescript} label="TypeScript" />
                                <TechIcon icon={SiReact} label="React" />
                                <TechIcon icon={SiNextdotjs} label="Next.js" />
                                <TechIcon icon={SiNodedotjs} label="Node.js" />
                                <TechIcon icon={SiTailwindcss} label="Tailwind" />
                                <TechIcon icon={SiGo} label="Go" />
                                <TechIcon icon={SiPostgresql} label="PostgreSQL" />
                                <TechIcon icon={SiDocker} label="Docker" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Row 4: Introduction (asymmetric 5-col) + Quick stat (1-col) */}
                    <motion.div variants={itemVariants} className="col-span-6 md:col-span-5">
                        <div className="h-full rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-6 dark:from-amber-950/40 dark:via-orange-900/20 dark:to-yellow-950/40">
                            <div className="flex items-center gap-2 text-2xl">
                                <span>👋</span>
                                <h3 className="font-semibold">Hi there</h3>
                            </div>
                            <div className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
                                <p>
                                    I&apos;m Dominik, a {getAge()}-year-old software engineer from Prague. I work at{' '}
                                    <Link
                                        href="https://nfctron.com"
                                        target="_blank"
                                        className="font-medium text-orange-600 underline decoration-orange-300 underline-offset-4 transition-colors hover:text-orange-700 dark:text-orange-400 dark:decoration-orange-700 dark:hover:text-orange-300"
                                    >
                                        NFCtron
                                    </Link>{' '}
                                    as CISO, building secure payment solutions for events.
                                </p>
                                <p>
                                    Passionate about TypeScript, cybersecurity, and full stack development.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Age indicator - compact vertical accent */}
                    <motion.div variants={itemVariants} className="col-span-3 md:col-span-1">
                        <div className="flex h-full min-h-[120px] flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-emerald-500 to-teal-600 p-3 text-white">
                            <span className="text-3xl font-bold">{getAge()}</span>
                            <span className="text-xs opacity-80">years</span>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div variants={itemVariants} className="col-span-6">
                        <div className="rounded-3xl bg-gradient-to-br from-lime-300 via-emerald-200 to-teal-200 p-1 dark:from-lime-900/50 dark:via-emerald-900/30 dark:to-teal-900/40">
                            <div className="rounded-[22px] bg-white/90 p-6 backdrop-blur-xl dark:bg-neutral-900/90 md:p-8">
                                <ContactForm />
                            </div>
                        </div>
                    </motion.div>
                </motion.main>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mx-auto max-w-5xl px-4 pb-8 text-center"
                >
                    <div className="flex items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                        <Link href="https://github.com/dominikzabcik/website" target="_blank" className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100">
                            Source
                        </Link>
                        <Link href="/stats" className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100">
                            Stats
                        </Link>
                        <Link href="/experiments" className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100">
                            Experiments
                        </Link>
                    </div>
                    <p className="mt-4 text-xs text-neutral-400 dark:text-neutral-600">
                        © {new Date().getFullYear()} Dominik Žabčík • Built with Next.js & Tailwind
                    </p>
                </motion.footer>
            </div>
        </div>
    );
}
