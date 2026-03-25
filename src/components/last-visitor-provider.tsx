'use client';

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    LAST_VISITOR_SESSION,
    type LastVisitorApiResponse,
    type LastVisitorRecord,
} from '../types/last-visitor';

type LastVisitorState = {
    /** Previous visitor (before this tab’s ping), if any */
    previous: LastVisitorRecord | null;
    /** KV + env configured */
    enabled: boolean;
    /** POST finished (or restored from sessionStorage) */
    ready: boolean;
};

const defaultState: LastVisitorState = {
    previous: null,
    enabled: false,
    ready: false,
};

const LastVisitorContext = createContext<LastVisitorState>(defaultState);

export function LastVisitorProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<LastVisitorState>(defaultState);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (sessionStorage.getItem(LAST_VISITOR_SESSION.ping)) {
            const raw = sessionStorage.getItem(LAST_VISITOR_SESSION.preview);
            const enabled =
                sessionStorage.getItem(LAST_VISITOR_SESSION.kvEnabled) === '1';
            setState({
                previous: raw ? (JSON.parse(raw) as LastVisitorRecord) : null,
                enabled,
                ready: true,
            });
            return;
        }

        let cancelled = false;

        fetch('/api/last-visitor', { method: 'POST' })
            .then((r) => r.json() as Promise<LastVisitorApiResponse>)
            .then((data) => {
                if (cancelled) return;
                sessionStorage.setItem(LAST_VISITOR_SESSION.ping, '1');
                sessionStorage.setItem(
                    LAST_VISITOR_SESSION.kvEnabled,
                    data.enabled ? '1' : '0',
                );
                if (data.enabled && data.previous) {
                    sessionStorage.setItem(
                        LAST_VISITOR_SESSION.preview,
                        JSON.stringify(data.previous),
                    );
                } else {
                    sessionStorage.removeItem(LAST_VISITOR_SESSION.preview);
                }
                setState({
                    previous: data.enabled ? data.previous : null,
                    enabled: data.enabled,
                    ready: true,
                });
            })
            .catch(() => {
                if (cancelled) return;
                sessionStorage.setItem(LAST_VISITOR_SESSION.ping, '1');
                sessionStorage.setItem(LAST_VISITOR_SESSION.kvEnabled, '0');
                setState({ previous: null, enabled: false, ready: true });
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo(() => state, [state]);

    return (
        <LastVisitorContext.Provider value={value}>
            {children}
        </LastVisitorContext.Provider>
    );
}

export function useLastVisitor() {
    return useContext(LastVisitorContext);
}
