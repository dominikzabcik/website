import type * as Party from 'partykit/server';

type Cell = 0 | 1 | 2;
type Phase = 'waiting' | 'playing' | 'paused';
type Role = 'x' | 'o' | 'spectator';

const RECONNECT_MS = 15_000;

const WIN_LINES: readonly (readonly [number, number, number])[] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function emptyBoard(): Cell[] {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

/** 0 = draw, null = not terminal */
function outcome(board: Cell[]): 1 | 2 | 0 | null {
    for (const [a, b, c] of WIN_LINES) {
        const v = board[a];
        if (
            v !== undefined &&
            v !== 0 &&
            v === board[b] &&
            v === board[c]
        ) {
            return v;
        }
    }
    if (board.every((c) => c !== 0)) {
        return 0;
    }
    return null;
}

type ClientMsg =
    | { type: 'hello'; token: string }
    | { type: 'move'; index: number }
    | { type: 'rematch' };

type ServerSnapshot = {
    type: 'state';
    board: Cell[];
    turn: 1 | 2;
    phase: Phase;
    /** null = in progress */
    gameOver: 'x' | 'o' | 'draw' | null;
    yourRole: Role | null;
    reconnectSecondsLeft: number | null;
    pausedSeat: 'x' | 'o' | null;
};

export default class TicTacToeRoom implements Party.Server {
    constructor(readonly room: Party.Room) {}

    private board: Cell[] = emptyBoard();
    private turn: 1 | 2 = 1;
    private phase: Phase = 'waiting';
    private xToken: string | null = null;
    private oToken: string | null = null;
    private xConn: string | null = null;
    private oConn: string | null = null;
    private disconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private pausedSeat: 'x' | 'o' | null = null;
    private reconnectDeadlineMs: number | null = null;

    private clearDisconnectTimer(): void {
        if (this.disconnectTimer) {
            clearTimeout(this.disconnectTimer);
            this.disconnectTimer = null;
        }
        this.reconnectDeadlineMs = null;
        this.pausedSeat = null;
    }

    private scheduleDisconnectReset(seat: 'x' | 'o'): void {
        this.clearDisconnectTimer();
        this.pausedSeat = seat;
        this.phase = 'paused';
        this.reconnectDeadlineMs = Date.now() + RECONNECT_MS;
        this.disconnectTimer = setTimeout(() => {
            this.disconnectTimer = null;
            this.fullReset('timeout');
        }, RECONNECT_MS);
    }

    /** After timeout or manual reset: empty seats; clients re-send hello. */
    private fullReset(_reason: 'timeout' | 'admin'): void {
        this.clearDisconnectTimer();
        this.board = emptyBoard();
        this.turn = 1;
        this.phase = 'waiting';
        this.xToken = null;
        this.oToken = null;
        this.xConn = null;
        this.oConn = null;
        this.broadcastState();
    }

    private handleRematch(sender: Party.Connection): void {
        if (this.phase === 'paused') {
            return;
        }
        if (outcome(this.board) === null) {
            return;
        }
        const role = this.roleForConnection(sender.id);
        if (role !== 'x' && role !== 'o') {
            return;
        }
        this.board = emptyBoard();
        this.turn = 1;
        this.phase = 'playing';
        this.broadcastState();
    }

    private tryStartOrResume(): void {
        const xOn = this.xConn !== null;
        const oOn = this.oConn !== null;
        if (xOn && oOn && this.phase === 'waiting') {
            this.board = emptyBoard();
            this.turn = 1;
            this.phase = 'playing';
        }
        if (
            xOn &&
            oOn &&
            this.phase === 'paused' &&
            this.pausedSeat === null
        ) {
            this.phase = 'playing';
        }
    }

    private roleForConnection(connId: string): Role | null {
        if (connId === this.xConn) {
            return 'x';
        }
        if (connId === this.oConn) {
            return 'o';
        }
        return null;
    }

    private snapshotFor(connId: string): ServerSnapshot {
        const oc = outcome(this.board);
        let gameOver: 'x' | 'o' | 'draw' | null = null;
        if (oc === 1) {
            gameOver = 'x';
        } else if (oc === 2) {
            gameOver = 'o';
        } else if (oc === 0) {
            gameOver = 'draw';
        }

        let yourRole: Role | null = this.roleForConnection(connId);
        if (yourRole === null) {
            yourRole = 'spectator';
        }

        let reconnectSecondsLeft: number | null = null;
        if (this.reconnectDeadlineMs !== null) {
            reconnectSecondsLeft = Math.max(
                0,
                Math.ceil((this.reconnectDeadlineMs - Date.now()) / 1000),
            );
        }

        return {
            type: 'state',
            board: [...this.board],
            turn: this.turn,
            phase: this.phase,
            gameOver,
            yourRole,
            reconnectSecondsLeft,
            pausedSeat: this.pausedSeat,
        };
    }

    private broadcastState(): void {
        for (const conn of this.room.getConnections()) {
            conn.send(JSON.stringify(this.snapshotFor(conn.id)));
        }
    }

    private assignHello(sender: Party.Connection, token: string): void {
        const t = token.trim();
        if (!t) {
            return;
        }

        if (this.xToken === t && this.xConn === null) {
            this.xConn = sender.id;
            if (this.pausedSeat === 'x') {
                this.clearDisconnectTimer();
            }
            this.tryStartOrResume();
            this.broadcastState();
            return;
        }
        if (this.oToken === t && this.oConn === null) {
            this.oConn = sender.id;
            if (this.pausedSeat === 'o') {
                this.clearDisconnectTimer();
            }
            this.tryStartOrResume();
            this.broadcastState();
            return;
        }

        if (this.xConn === null && this.xToken === null) {
            this.xToken = t;
            this.xConn = sender.id;
            this.tryStartOrResume();
            this.broadcastState();
            return;
        }
        if (this.oConn === null && this.oToken === null) {
            this.oToken = t;
            this.oConn = sender.id;
            this.tryStartOrResume();
            this.broadcastState();
        }
    }

    private handleMove(sender: Party.Connection, index: number): void {
        if (!Number.isInteger(index) || index < 0 || index > 8) {
            return;
        }
        if (this.phase !== 'playing') {
            return;
        }
        const role = this.roleForConnection(sender.id);
        if (role !== 'x' && role !== 'o') {
            return;
        }
        const cell: 1 | 2 = role === 'x' ? 1 : 2;
        if (this.turn !== cell) {
            return;
        }
        if (this.board[index] !== 0) {
            return;
        }
        if (outcome(this.board) !== null) {
            return;
        }

        const next = [...this.board] as Cell[];
        next[index] = cell;
        this.board = next;

        const done = outcome(this.board);
        if (done === null) {
            this.turn = cell === 1 ? 2 : 1;
        }
        this.broadcastState();
    }

    onConnect(_connection: Party.Connection): void {
        this.broadcastState();
    }

    onMessage(
        message: string | ArrayBuffer | ArrayBufferView,
        sender: Party.Connection,
    ): void {
        if (typeof message !== 'string') {
            return;
        }
        let parsed: ClientMsg;
        try {
            parsed = JSON.parse(message) as ClientMsg;
        } catch {
            return;
        }
        if (parsed.type === 'hello' && typeof parsed.token === 'string') {
            this.assignHello(sender, parsed.token);
            return;
        }
        if (parsed.type === 'move' && typeof parsed.index === 'number') {
            this.handleMove(sender, parsed.index);
            return;
        }
        if (parsed.type === 'rematch') {
            this.handleRematch(sender);
        }
    }

    onClose(connection: Party.Connection): void {
        const id = connection.id;
        const terminal = outcome(this.board) !== null;

        if (id !== this.xConn && id !== this.oConn) {
            return;
        }

        if (this.phase === 'paused') {
            this.fullReset('timeout');
            return;
        }

        if (id === this.xConn) {
            this.xConn = null;
            if (terminal) {
                this.xToken = null;
            } else if (this.phase === 'waiting') {
                this.xToken = null;
            } else if (this.phase === 'playing') {
                this.scheduleDisconnectReset('x');
            }
        } else {
            this.oConn = null;
            if (terminal) {
                this.oToken = null;
            } else if (this.phase === 'waiting') {
                this.oToken = null;
            } else if (this.phase === 'playing') {
                this.scheduleDisconnectReset('o');
            }
        }

        if (this.xConn === null && this.oConn === null) {
            this.fullReset('timeout');
        } else {
            this.broadcastState();
        }
    }
}
