export type TicTacToePhase = 'waiting' | 'playing' | 'paused';

export type TicTacToeSnapshot = {
    type: 'state';
    board: number[];
    turn: 1 | 2;
    phase: TicTacToePhase;
    gameOver: 'x' | 'o' | 'draw' | null;
    yourRole: 'x' | 'o' | 'spectator' | null;
    reconnectSecondsLeft: number | null;
    pausedSeat: 'x' | 'o' | null;
};
