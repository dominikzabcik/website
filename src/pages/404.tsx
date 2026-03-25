'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function Page404() {
    return (
        <div className="relative flex min-h-screen items-center justify-center px-4">
            {/* Background gradient */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute -right-[20%] -top-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-3xl" />
                <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-500/10 to-rose-500/5 blur-3xl" />
            </div>

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="mb-6 text-8xl font-light tracking-tight text-neutral-300 dark:text-neutral-700"
                >
                    404
                </motion.div>
                
                <h1 className="mb-4 text-2xl font-medium text-neutral-900 dark:text-neutral-100">
                    Page not found
                </h1>
                
                <p className="mb-8 text-neutral-600 dark:text-neutral-400">
                    Sorry, I couldn&apos;t locate that page for you.
                </p>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        Back home
                    </Link>
                </motion.div>
            </motion.main>
        </div>
    );
}
