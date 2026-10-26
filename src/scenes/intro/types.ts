export const Expression = {
    Angry:   "angry",
    Furious: "furious",
    Greedy:  "greedy",
    Sad:     "sad",
    Shocked: "shocked",
} as const;

export type Expression = typeof Expression[keyof typeof Expression];

// hidden per-run values; choices move them, routes and gated options read them
export type Stat = "anger" | "communism" | "corruption" | "fame" | "money" | "peronism";

export type Stats = Record<Stat, number>;

export const EMPTY_STATS: Stats = {
    anger:      0,
    communism:  0,
    corruption: 0,
    fame:       0,
    money:      0,
    peronism:   0,
};
