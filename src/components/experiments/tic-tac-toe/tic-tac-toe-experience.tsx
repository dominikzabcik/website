'use client';

import Link from 'next/link';
import type { TicTacToeSnapshot } from '../../../lib/tic-tac-toe-types';
import { GameCanvas } from './game-canvas';
import { usePartyGame } from './use-party-game';

function statusLine(snapshot: TicTacToeSnapshot | null): string {
    if (!snapshot) {
        return 'Connecting…';
    }
    if (snapshot.phase === 'paused' && snapshot.reconnectSecondsLeft !== null) {
        return `Paused — waiting for ${snapshot.pausedSeat === 'x' ? 'X' : 'O'} to reconnect (${snapshot.reconnectSecondsLeft}s)`;
    }
    if (snapshot.phase === 'waiting') {
        return 'Waiting for a second player…';
    }
    if (snapshot.gameOver === 'draw') {
        return 'Draw.';
    }
    if (snapshot.gameOver === 'x') {
        return 'X wins.';
    }
    if (snapshot.gameOver === 'o') {
        return 'O wins.';
    }
    const need = snapshot.turn === 1 ? 'X' : 'O';
    return `${need} to move`;
}

export function TicTacToeExperience() {
    const { snapshot, connected, socketError, sendMove, sendRematch } =
        usePartyGame();

    const role = snapshot?.yourRole ?? null;
    const canMove =
        snapshot !== null &&
        snapshot.phase === 'playing' &&
        snapshot.gameOver === null &&
        role !== null &&
        role !== 'spectator' &&
        snapshot.turn === (role === 'x' ? 1 : 2);

    const showRematch =
        snapshot !== null &&
        snapshot.gameOver !== null &&
        role !== 'spectator' &&
        role !== null;

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <nav className="mb-8 text-sm text-neutral-500">
                <Link
                    href="/experiments"
                    className="text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline"
                >
                    Experiments
                </Link>
                <span className="mx-2 text-neutral-600">/</span>
                <span className="text-neutral-300">3D tic-tac-toe</span>
            </nav>

            <header className="mb-6">
                <h1 className="font-[family-name:var(--font-title)] text-3xl font-semibold tracking-tight text-neutral-50 md:text-4xl">
                    3D tic-tac-toe
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">
                    Two players join the same room; everyone else spectates. If a
                    player drops, they have 15 seconds to reconnect or the match
                    resets.
                </p>
            </header>

            {socketError ? (
                <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                    {socketError}
                </div>
            ) : null}

            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                        connected
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-neutral-800 text-neutral-500'
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            connected ? 'bg-emerald-400' : 'bg-neutral-600'
                        }`}
                    />
                    {connected ? 'Live' : 'Offline'}
                </span>
                {role !== null && role !== 'spectator' ? (
                    <span className="rounded-full bg-neutral-800 px-3 py-1 text-neutral-200">
                        You are{' '}
                        <strong className="text-white">
                            {role === 'x' ? 'X' : 'O'}
                        </strong>
                    </span>
                ) : role === 'spectator' ? (
                    <span className="rounded-full bg-neutral-800 px-3 py-1 text-neutral-400">
                        Spectating
                    </span>
                ) : null}
            </div>

            <p className="mb-3 text-sm text-neutral-400">{statusLine(snapshot)}</p>

            <GameCanvas
                board={snapshot?.board ?? [0, 0, 0, 0, 0, 0, 0, 0, 0]}
                interactive={Boolean(canMove)}
                onCellClick={sendMove}
            />

            {showRematch ? (
                <div className="mt-5">
                    <button
                        type="button"
                        onClick={() => sendRematch()}
                        className="rounded-full bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white"
                    >
                        Play again
                    </button>
                </div>
            ) : null}

            <section className="mt-10 rounded-2xl border border-white/10 bg-neutral-900/50 p-5 text-sm text-neutral-400">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Local development
                </h2>
                <p className="mt-2 leading-relaxed">
                    Run the Next app and PartyKit together:{' '}
                    <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-200">
                        bun run dev:multiplayer
                    </code>
                    . Deploy the party with{' '}
                    <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-200">
                        bunx partykit deploy
                    </code>{' '}
                    and set{' '}
                    <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-200">
                        NEXT_PUBLIC_PARTYKIT_HOST
                    </code>{' '}
                    to your project host (e.g.{' '}
                    <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-200">
                        your-project.yourname.partykit.dev
                    </code>
                    ).
                </p>
            </section>
        </div>
    );
}
