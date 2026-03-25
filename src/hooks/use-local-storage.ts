import {
    type Dispatch,
    type SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

/**
 * Value from localStorage with a setter, synced across tabs via the `storage` event.
 */
export function useLocalStorage<T>(
    key: string,
    init: () => T,
): [value: T, set: Dispatch<SetStateAction<T>>] {
    const stableInit = useRef(init);

    useEffect(() => {
        stableInit.current = init;
    }, [init]);

    const write = useCallback(
        (value: T) => {
            window.localStorage.setItem(key, JSON.stringify(value));
            return value;
        },
        [key],
    );

    const getOrInit = useCallback(() => {
        if (typeof window === 'undefined') {
            return stableInit.current();
        }

        const value = window.localStorage.getItem(key);

        if (value === null) {
            const initialised = stableInit.current();
            return write(initialised);
        }

        return JSON.parse(value) as T;
    }, [key, write]);

    const [value, setValue] = useState<T>(() => getOrInit());

    const notify = useCallback(() => {
        setValue(getOrInit());
    }, [getOrInit]);

    useEffect(() => {
        const listener = (event: StorageEvent) => {
            if (event.key === key) {
                notify();
            }
        };

        window.addEventListener('storage', listener);

        return () => {
            window.removeEventListener('storage', listener);
        };
    }, [key, notify]);

    const set = useCallback(
        (action: SetStateAction<T>) => {
            const current = getOrInit();

            let next: T;

            if (action instanceof Function) {
                next = write(action(current));
            } else {
                next = write(action);
            }

            setValue(next);

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key,
                    oldValue: JSON.stringify(current),
                    newValue: JSON.stringify(next),
                    url: window.location.href,
                }),
            );
        },
        [getOrInit, write, key],
    );

    return [value, set];
}
