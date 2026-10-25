export type Ending = {
    id:   string;
    name: string;
};

export const ENDINGS = [
    { id: "kremlin-troll", name: "Troll del Kremlin" },
] as const satisfies readonly Ending[];

export type EndingId = typeof ENDINGS[number]["id"];
