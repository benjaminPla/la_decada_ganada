export type Ending = {
    id:   string;
    name: string;
};

export const ENDINGS = [
    { id: "flotilla",       name: "Flotilla de la Libertad" },
    { id: "kremlin-troll",  name: "Troll del Kremlin" },
    { id: "maximo",         name: "El tiro de Máximo" },
    { id: "rabia",          name: "Rabia" },
    { id: "san-jose-vigil", name: "Vigilia en San José 1111" },
] as const satisfies readonly Ending[];

export type EndingId = typeof ENDINGS[number]["id"];
