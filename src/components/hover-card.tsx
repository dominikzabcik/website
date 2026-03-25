'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardHoverEffectProps {
    children: ReactNode;
    className?: string;
}

export const hoverClassName =
    'transition-all duration-500 ease-out-expo will-change-transform';

export function CardHoverEffect({ children, className = '' }: CardHoverEffectProps) {
    return (
        <motion.div
            className={`group ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
            }}
        >
            <div className="relative h-full w-full overflow-hidden rounded-3xl">
                {/* Spotlight effect overlay */}
                <div className="spotlight pointer-events-none absolute inset-0 z-10" />
                {children}
            </div>
        </motion.div>
    );
}

// Simpler hover effect without framer-motion for lighter use
export function HoverScale({ 
    children, 
    className = '',
    scale = 1.02,
}: { 
    children: ReactNode; 
    className?: string;
    scale?: number;
}) {
    return (
        <div 
            className={`transition-transform duration-500 ease-out-expo hover:scale-[${scale}] ${className}`}
        >
            {children}
        </div>
    );
}

// Animated gradient border effect
export function GradientBorder({ 
    children, 
    className = '' 
}: { 
    children: ReactNode; 
    className?: string;
}) {
    return (
        <div className={`relative rounded-3xl p-[1px] ${className}`}>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative h-full rounded-3xl">
                {children}
            </div>
        </div>
    );
}

// Magnetic button effect
export function MagneticButton({ 
    children, 
    className = '',
    onClick,
}: { 
    children: ReactNode; 
    className?: string;
    onClick?: () => void;
}) {
    return (
        <motion.button
            className={`relative overflow-hidden rounded-2xl ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
            }}
            onClick={onClick}
        >
            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                whileHover={{ translateX: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
            {children}
        </motion.button>
    );
}
