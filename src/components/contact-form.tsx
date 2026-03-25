'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiSend, FiCheck, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function ContactForm() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full flex-col items-center justify-center space-y-4 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-black/10 dark:bg-white/10"
                >
                    <FiCheck className="h-8 w-8 text-black dark:text-white" />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-semibold">Message sent!</h2>
                    <p className="mt-2 text-black/70 dark:text-white/70">
                        Thanks for reaching out. I&apos;ll get back to you soon.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Let&apos;s talk</h2>
                <p className="text-black/70 dark:text-white/70">
                    Have a project in mind? Send me a message.
                </p>
            </div>

            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    const values = Object.fromEntries(
                        new FormData(event.target as HTMLFormElement).entries(),
                    );

                    setLoading(true);

                    const promise = fetch('/api/contact', {
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(values),
                        method: 'POST',
                    });

                    await toast
                        .promise(promise, {
                            success: 'Message sent!',
                            loading: 'Sending...',
                            error: (error: Error) =>
                                error?.message ?? 'Something went wrong...',
                        })
                        .then(async () => {
                            setSubmitted(true);
                        })
                        .catch(() => null)
                        .finally(() => {
                            setLoading(false);
                        });
                }}
                method="POST"
                action="/api/contact"
                className="space-y-4"
            >
                {/* Email Field */}
                <motion.div 
                    className="relative"
                    initial={false}
                    animate={{ 
                        scale: focusedField === 'email' ? 1.02 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        placeholder="your@email.com"
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full rounded-2xl border-0 bg-black/5 px-5 py-4 text-black placeholder:text-black/40 focus:bg-white focus:ring-2 focus:ring-black/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-neutral-900 dark:focus:ring-white/10"
                    />
                </motion.div>

                {/* Message Field */}
                <motion.div 
                    className="relative"
                    initial={false}
                    animate={{ 
                        scale: focusedField === 'body' ? 1.02 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    <label htmlFor="body" className="sr-only">Message</label>
                    <textarea
                        id="body"
                        name="body"
                        rows={4}
                        minLength={10}
                        required
                        placeholder="Tell me about your project..."
                        onFocus={() => setFocusedField('body')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full resize-none rounded-2xl border-0 bg-black/5 px-5 py-4 text-black placeholder:text-black/40 focus:bg-white focus:ring-2 focus:ring-black/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-neutral-900 dark:focus:ring-white/10"
                    />
                </motion.div>

                <Turnstile
                    options={{ responseFieldName: 'turnstile' }}
                    style={{ display: 'none' }}
                    siteKey="0x4AAAAAAABwxsgAijQAi5FS"
                />

                {/* Submit Button */}
                <motion.button
                    disabled={loading}
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-black py-4 font-medium text-white transition-all hover:shadow-xl dark:bg-white dark:text-black"
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.span
                                key="loading"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2"
                            >
                                <FiLoader className="animate-spin" />
                                Sending...
                            </motion.span>
                        ) : (
                            <motion.span
                                key="send"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2"
                            >
                                Send message
                                <FiSend className="transition-transform group-hover:translate-x-1" />
                            </motion.span>
                        )}
                    </AnimatePresence>
                    
                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        whileHover={{ translateX: '100%' }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.button>
            </form>
        </div>
    );
}
