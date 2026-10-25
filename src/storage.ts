export function readJson(key: string): unknown {
    try {
        return JSON.parse(localStorage.getItem(key) ?? "null");
    } catch {
        return null;
    }
}

export function writeJson(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // storage blocked or full: keep in-memory state
    }
}
