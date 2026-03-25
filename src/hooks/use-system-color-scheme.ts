'use client';

import { useEffect } from 'react';

/**
 * Keeps `<html class="dark">` in sync with `prefers-color-scheme`.
 * Light → no `dark` class. Dark or no-preference → `dark` (default dark).
 */
export function useSystemColorScheme() {
    useEffect(() => {
        const root = document.documentElement;
        const apply = () => {
            const prefersLight = window.matchMedia(
                '(prefers-color-scheme: light)',
            ).matches;
            root.classList.toggle('dark', !prefersLight);
        };

        apply();

        const mq = window.matchMedia('(prefers-color-scheme: light)');
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);
}
