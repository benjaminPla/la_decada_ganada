import { ENDINGS, type EndingId } from "./endings";
import Phaser from "phaser";
import type { Stats } from "../stats";
import { UNLOCKABLES, type Unlockable, type UnlockableId } from "./unlockables";
import { readJson, writeJson } from "../storage";

export type GameEvent =
    | { choice: string; stats: Readonly<Stats>; type: "choice-made" }
    | { ending: EndingId; type: "ending-reached" }
    | { type: "run-started" };

export type Progress = {
    endings:  string[];
    stats:    { runsStarted: number };
    unlocked: string[];
};

export const ENDING_EVENT = "progress-ending";
export const UNLOCK_EVENT = "progress-unlock";

const STORAGE_KEY = "la-decada-ganada:progress";

let progress = load();

// share of objects and endings found, 0 to 1; only counts ids that still exist
export function getCompletion() {
    const found = UNLOCKABLES.filter(({ id }) => progress.unlocked.includes(id)).length
        + ENDINGS.filter(({ id }) => progress.endings.includes(id)).length;
    return found / (UNLOCKABLES.length + ENDINGS.length);
}

export function getProgress(): Readonly<Progress> {
    return progress;
}

export function isUnlocked(id: UnlockableId) {
    return progress.unlocked.includes(id);
}

// every gameplay fact goes through here; unlock rules react to events instead of being called from scenes
export function track(game: Phaser.Game, event: GameEvent) {
    const isNewEnding = event.type === "ending-reached" && !progress.endings.includes(event.ending);
    record(event);

    const unlocked: Unlockable[] = UNLOCKABLES.filter((u: Unlockable) =>
        u.on === event.type && !progress.unlocked.includes(u.id) && u.condition(progress, event));
    progress.unlocked.push(...unlocked.map(({ id }) => id));

    writeJson(STORAGE_KEY, progress);
    unlocked.forEach((u) => game.events.emit(UNLOCK_EVENT, u));
    if (isNewEnding) {
        game.events.emit(ENDING_EVENT, ENDINGS.find(({ id }) => id === event.ending));
    }
}

function record(event: GameEvent) {
    switch (event.type) {
        case "choice-made":
            break;
        case "ending-reached":
            if (!progress.endings.includes(event.ending)) {
                progress.endings.push(event.ending);
            }
            break;
        case "run-started":
            progress.stats.runsStarted++;
            break;
    }
}

function load(): Progress {
    const saved = readJson(STORAGE_KEY) as Partial<Progress> | null;
    const strings = (value: unknown) => Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

    return {
        endings:  strings(saved?.endings),
        stats:    { runsStarted: Math.max(0, Number(saved?.stats?.runsStarted) || 0) },
        unlocked: strings(saved?.unlocked),
    };
}
