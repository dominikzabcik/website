'use client';

import PartySocket from 'partysocket';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { randomUUID } from '../../../lib/random-uuid';
import type { TicTacToeSnapshot } from '../../../lib/tic-tac-toe-types';

const TOKEN_KEY = 'ttt-party-token';

function getOrCreateToken(): string {
    if (typeof window === 'undefined') {
        return '';
    }
    try {
        const existing = sessionStorage.getItem(TOKEN_KEY);
        if (existing && existing.length > 0) {
            return existing;
        }
        const t = randomUUID();
        sessionStorage.setItem(TOKEN_KEY, t);
        return t;
    } catch {
        return randomUUID();
    }
}

export function getPartyHost(): string {
    return (
        process.env.NEXT_PUBLIC_PARTYKIT_HOST?.trim() || 'localhost:1999'
    );
}

export function usePartyGame() {
    const [snapshot, setSnapshot] = useState<TicTacToeSnapshot | null>(null);
    const [connected, setConnected] = useState(false);
    const [socketError, setSocketError] = useState<string | null>(null);
    const socketRef = useRef<PartySocket | null>(null);

    const token = useMemo(() => getOrCreateToken(), []);

    const sendMove = useCallback((index: number) => {
        const ws = socketRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            return;
        }
        ws.send(JSON.stringify({ type: 'move', index }));
    }, []);

    const sendRematch = useCallback(() => {
        const ws = socketRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            return;
        }
        ws.send(JSON.stringify({ type: 'rematch' }));
    }, []);

    useEffect(() => {
        const host = getPartyHost();
        const ws = new PartySocket({
            host,
            room: 'global',
        });
        socketRef.current = ws;

        const onOpen = () => {
            setConnected(true);
            setSocketError(null);
            ws.send(JSON.stringify({ type: 'hello', token }));
        };

        const onMessage = (ev: MessageEvent) => {
            try {
                const data = JSON.parse(String(ev.data)) as TicTacToeSnapshot;
                if (data.type === 'state') {
                    setSnapshot(data);
                }
            } catch {
                /* ignore */
            }
        };

        const onClose = () => {
            setConnected(false);
        };

        const onError = () => {
            setSocketError(
                'Could not connect to the game server. Run PartyKit locally (see this page) or set NEXT_PUBLIC_PARTYKIT_HOST.',
            );
        };

        ws.addEventListener('open', onOpen);
        ws.addEventListener('message', onMessage);
        ws.addEventListener('close', onClose);
        ws.addEventListener('error', onError);

        return () => {
            ws.removeEventListener('open', onOpen);
            ws.removeEventListener('message', onMessage);
            ws.removeEventListener('close', onClose);
            ws.removeEventListener('error', onError);
            socketRef.current = null;
            ws.close();
        };
    }, [token]);

    return {
        snapshot,
        connected,
        socketError,
        sendMove,
        sendRematch,
    };
}
