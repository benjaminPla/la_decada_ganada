import type { GameEvent, Progress } from ".";

export type Unlockable = {
    condition:   (progress: Readonly<Progress>, event: GameEvent) => boolean;
    description: string;
    id:          string;
    name:        string;
    on:          GameEvent["type"];
};

const DILDO_LGBT = 3;
const PALESTINE_FLAG_PALESTINE = 3;

export const UNLOCKABLES = [
    {
        condition:   (_, event) => event.type === "choice-made" && event.stats.palestine >= PALESTINE_FLAG_PALESTINE,
        description: "Para el living. Al lado de Cristina.",
        id:          "bandera-palestina",
        name:        "Bandera de Palestina",
        on:          "choice-made",
    },
    {
        condition:   (_, event) => event.type === "choice-made" && event.stats.lgbt >= DILDO_LGBT,
        description: "Para el baño. Nadie pregunta.",
        id:          "consolador-arcoiris",
        name:        "Consolador arcoíris",
        on:          "choice-made",
    },
    {
        condition:   ({ stats }) => stats.runsStarted >= 1,
        description: "Para el living. Siempre vuelven.",
        id:          "poster-vamos-a-volver",
        name:        "Póster «Vamos a volver»",
        on:          "run-started",
    },
] as const satisfies readonly Unlockable[];

export type UnlockableId = typeof UNLOCKABLES[number]["id"];
