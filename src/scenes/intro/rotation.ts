import Phaser from "phaser";
import { readJson, writeJson } from "../../storage";

const STORAGE_KEY = "la-decada-ganada:openings";

// shuffle bag: every opening plays once, in random order, before any repeats; never the same one twice in a row
export function nextOpening<T extends string>(ids: readonly T[]): T {
    const saved = readJson(STORAGE_KEY) as { bag?: unknown; last?: unknown } | null;
    const isId = (value: unknown): value is T => (ids as readonly unknown[]).includes(value);
    const last = isId(saved?.last) ? saved.last : null;
    let bag = Array.isArray(saved?.bag) ? saved.bag.filter(isId) : [];

    if (bag.length === 0) {
        bag = Phaser.Utils.Array.Shuffle([...ids]);
        if (bag.length > 1 && bag[0] === last) {
            bag.push(bag.shift()!);
        }
    }
    const [next, ...rest] = bag;
    writeJson(STORAGE_KEY, { bag: rest, last: next });
    return next;
}
