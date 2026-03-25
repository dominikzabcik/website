/**
 * RFC4122-style v4 UUID. Uses `crypto.randomUUID` when available; falls back for
 * older browsers, insecure HTTP contexts, or environments where the API is missing.
 */
export function randomUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        try {
            return crypto.randomUUID();
        } catch {
            /* non-secure context or other runtime failure */
        }
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
