import Head from 'next/head';
import Link from 'next/link';

export default function ExperimentsIndexPage() {
    return (
        <>
            <Head>
                <title>Experiments — Dominik Žabčík</title>
                <meta
                    name="description"
                    content="Vibe-coded fun: experimental multiplayer games and side projects."
                />
            </Head>
            <div className="min-h-screen bg-neutral-950 text-neutral-100">
                <div className="mx-auto max-w-3xl px-4 py-12">
                    <nav className="mb-10 text-sm text-neutral-500">
                        <Link
                            href="/"
                            className="text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline"
                        >
                            Home
                        </Link>
                    </nav>
                    <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold tracking-tight text-neutral-50">
                        Experiments
                    </h1>
                    <p className="mt-3 max-w-lg text-neutral-400">
                        Vibe-coded fun — small multiplayer toys and prototypes, not
                        a roadmap. More soon.
                    </p>
                    <ul className="mt-10 space-y-4">
                        <li>
                            <Link
                                href="/experiments/tic-tac-toe"
                                className="group block rounded-2xl border border-white/10 bg-neutral-900/60 p-5 transition hover:border-white/20 hover:bg-neutral-900"
                            >
                                <span className="text-lg font-medium text-white">
                                    3D tic-tac-toe
                                </span>
                                <span className="mt-1 block text-sm text-neutral-500 group-hover:text-neutral-400">
                                    Two players, spectators, 15s reconnect grace —
                                    PartyKit + React Three Fiber
                                </span>
                            </Link>
                        </li>
                        <li>
                            <div
                                className="rounded-2xl border border-dashed border-white/10 bg-neutral-950/80 p-5 text-neutral-500"
                                role="status"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-lg font-medium text-neutral-400">
                                        Multiplayer car racing
                                    </span>
                                    <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                                        Coming soon
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-neutral-600">
                                    Real-time racing — planned; not wired up yet.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
