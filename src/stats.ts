// hidden per-run values; choices move them, routes, gated options and unlockables read them
export type Stat = "anger" | "communism" | "corruption" | "fame" | "lgbt" | "money" | "palestine" | "peronism";

export type Stats = Record<Stat, number>;

export const EMPTY_STATS: Stats = {
    anger:      0,
    communism:  0,
    corruption: 0,
    fame:       0,
    lgbt:       0,
    money:      0,
    palestine:  0,
    peronism:   0,
};
