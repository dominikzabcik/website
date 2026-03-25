'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { PragueTimeFormatter, daysUntilBirthday } from '../utils/constants';

function StarField() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);

        // Draw stars
        const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
        for (let i = 0; i < 60; i++) {
            stars.push({
                x: Math.random() * canvas.offsetWidth,
                y: Math.random() * canvas.offsetHeight,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random(),
                speed: Math.random() * 0.02 + 0.005,
            });
        }

        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            
            stars.forEach((star) => {
                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0) {
                    star.speed = -star.speed;
                }
                
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
        />
    );
}

function Night({ time }: { time: Date }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={clsx(
                'relative flex h-full items-center justify-center overflow-hidden rounded-3xl',
                'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white'
            )}
        >
            <StarField />
            
            {/* Moon */}
            <motion.div
                className="absolute right-4 top-4"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
                <FiMoon className="h-6 w-6 text-yellow-100/80" />
            </motion.div>

            <div className="z-10 text-center">
                    <motion.h2
                    className="text-3xl font-light tracking-tight"
                    suppressHydrationWarning
                >
                    {PragueTimeFormatter.format(time)}
                </motion.h2>
                <p className="mt-1 text-sm text-white/60">
                    in Prague
                </p>
            </div>
        </motion.div>
    );
}

function Day({ time }: { time: Date }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex h-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-blue-400 to-cyan-300"
        >
            {/* Animated sun rays */}
            <motion.div
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/30 blur-2xl"
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Sun */}
            <motion.div
                className="absolute right-4 top-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
                <FiSun className="h-8 w-8 text-yellow-200" />
            </motion.div>

            {/* Cloud decorations */}
            <motion.div
                className="absolute bottom-4 left-4 h-8 w-16 rounded-full bg-white/20 blur-sm"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-8 right-8 h-6 w-12 rounded-full bg-white/15 blur-sm"
                animate={{ x: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <div className="z-10 text-center">
                <motion.h2
                    className="text-3xl font-light tracking-tight text-white"
                    suppressHydrationWarning
                >
                    {PragueTimeFormatter.format(time)}
                </motion.h2>
                <p className="mt-1 text-sm text-white/70">
                    in Prague
                </p>
            </div>
        </motion.div>
    );
}

function BirthdayCountdown() {
    return (
        <motion.div 
            className="flex h-full items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <div className="text-center">
                <motion.span 
                    className="block text-4xl font-light text-violet-600 dark:text-violet-400"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                    {daysUntilBirthday}
                </motion.span>
                <span className="text-sm text-violet-500/80 dark:text-violet-300/80">
                    days until birthday
                </span>
            </div>
        </motion.div>
    );
}

export function Time() {
    const [time, setTime] = useState(() => new Date());
    const [mounted, setMounted] = useState(false);

    const isNight = time.getHours() >= 17 || time.getHours() < 6;

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <div className="col-span-3 grid h-52 shrink-0 grid-cols-1 gap-4 md:col-span-1">
                <div className="rounded-3xl bg-neutral-200 animate-pulse dark:bg-neutral-800" />
                <div className="rounded-3xl bg-neutral-200 animate-pulse dark:bg-neutral-800" />
            </div>
        );
    }

    return (
        <div className="col-span-3 grid h-52 shrink-0 grid-cols-1 gap-4 md:col-span-1">
            {isNight ? <Night time={time} /> : <Day time={time} />}
            <BirthdayCountdown />
        </div>
    );
}
