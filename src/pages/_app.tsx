import '../globals.css';

import type { AppProps } from 'next/app';
import { Inter, JetBrains_Mono, Newsreader } from 'next/font/google';
import localFont from 'next/font/local';
import Head from 'next/head';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { LastVisitorProvider } from '../components/last-visitor-provider';
import { useFirstEverLoad, useVisitCounts } from '../hooks/use-first-ever-load';
import { useSystemColorScheme } from '../hooks/use-system-color-scheme';

// Title font - elegant serif
const title = Newsreader({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
    fallback: ['Georgia', 'serif'],
    adjustFontFallback: false,
});

// Body font - clean sans-serif
const body = localFont({
    src: '../fonts/roobert-variable.woff2',
    variable: '--font-body',
    display: 'swap',
    fallback: ['Inter', 'system-ui', 'sans-serif'],
});

// Monospace font for code
const mono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
    variable: '--font-mono',
    display: 'swap',
});

// Inter as web font fallback
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
    useSystemColorScheme();
    useFirstEverLoad();

    const [_, set] = useVisitCounts();

    useEffect(() => {
        set((x) => x + 1);
    }, [set]);

    // Add smooth scroll behavior
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <>
            <style jsx global>
                {`
                    :root {
                        --font-title: ${title.style.fontFamily};
                        --font-body: ${body.style.fontFamily || inter.style.fontFamily};
                        --font-mono: ${mono.style.fontFamily};
                    }
                `}
            </style>

            <Head>
                <title>Dominik Žabčík — Full Stack Engineer & CISO</title>
                <meta
                    name="description"
                    content="Dominik Žabčík is a 22-year-old full stack TypeScript engineer and CISO at NFCtron from Prague, Czech Republic."
                />
                <meta
                    content="width=device-width, initial-scale=1"
                    name="viewport"
                />
                <meta name="theme-color" content="#0a0a0a" />
                <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
                <link rel="icon" href="/favicon.ico" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Dominik Žabčík — Full Stack Engineer & CISO" />
                <meta property="og:description" content="22-year-old full stack TypeScript engineer and CISO at NFCtron from Prague, Czech Republic." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://dominikzabcik.cz" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Dominik Žabčík — Full Stack Engineer & CISO" />
                <meta name="twitter:description" content="22-year-old full stack TypeScript engineer and CISO at NFCtron from Prague." />
            </Head>

            <div className={`${body.variable} ${mono.variable} ${inter.variable}`}>
                <LastVisitorProvider>
                    <Component {...pageProps} />
                </LastVisitorProvider>
            </div>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(23, 23, 23, 0.95)',
                        color: '#fafafa',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '16px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fafafa',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fafafa',
                        },
                    },
                }}
            />
        </>
    );
}
