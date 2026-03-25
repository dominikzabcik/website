import dynamic from 'next/dynamic';
import Head from 'next/head';

const TicTacToeExperience = dynamic(
    () =>
        import('../../components/experiments/tic-tac-toe/tic-tac-toe-experience').then(
            (m) => m.TicTacToeExperience,
        ),
    { ssr: false },
);

export default function TicTacToePage() {
    return (
        <>
            <Head>
                <title>3D tic-tac-toe — Experiments</title>
                <meta
                    name="description"
                    content="Real-time 3D tic-tac-toe: two players, spectators, reconnect grace."
                />
            </Head>
            <div className="min-h-screen bg-neutral-950 text-neutral-100">
                <TicTacToeExperience />
            </div>
        </>
    );
}
