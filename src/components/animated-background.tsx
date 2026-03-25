'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Animated gradient orbs that float in the background
export function AnimatedOrbs() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            {/* Gradient orb 1 - Top right */}
            <motion.div
                className="absolute -right-[20%] -top-[20%] h-[600px] w-[600px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            
            {/* Gradient orb 2 - Bottom left */}
            <motion.div
                className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
                }}
                animate={{
                    x: [0, -20, 0],
                    y: [0, 20, 0],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                }}
            />
            
            {/* Gradient orb 3 - Center (subtle) */}
            <motion.div
                className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
}

// Grid pattern with subtle animation
export function GridPattern({ 
    className = '' 
}: { 
    className?: string;
}) {
    return (
        <div className={`pointer-events-none absolute inset-0 ${className}`}>
            <div className="absolute inset-0 bg-grid-neutral-200/30 dark:bg-grid-neutral-800/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-50/50 dark:to-neutral-950/50" />
        </div>
    );
}

// Noise texture overlay for depth
export function NoiseTexture() {
    return (
        <div 
            className="pointer-events-none fixed inset-0 z-[100] opacity-[0.015] dark:opacity-[0.03]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
        />
    );
}

// Aurora background effect
export function AuroraBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <motion.div
                className="absolute -left-[50%] -top-[50%] h-[200%] w-[200%]"
                style={{
                    background: `
                        radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 60%, rgba(236, 72, 153, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse at 40% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
                    `,
                }}
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 120,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    );
}

// Spotlight cursor effect for cards
export function useSpotlight() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    
    return mousePosition;
}
