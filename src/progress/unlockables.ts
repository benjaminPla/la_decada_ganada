import type { GameEvent, Progress } from ".";

export type Unlockable = {
    condition:   (progress: Readonly<Progress>, event: GameEvent) => boolean;
    description: string;
    id:          string;
    name:        string;
    on:          GameEvent["type"];
};

export const UNLOCKABLES = [
    {
        condition:   ({ stats }) => stats.runsStarted >= 1,
        description: "Para el living. Siempre vuelven.",
        id:          "poster-vamos-a-volver",
        name:        "Póster «Vamos a volver»",
        on:          "run-started",
    },
] as const satisfies readonly Unlockable[];

export type UnlockableId = typeof UNLOCKABLES[number]["id"];
