export const Expression = {
    Angry:   "angry",
    Dead:    "dead",
    Furious: "furious",
    Greedy:  "greedy",
    Happy:   "happy",
    Sad:     "sad",
    Shocked: "shocked",
    Smug:    "smug",
} as const;

export type Expression = typeof Expression[keyof typeof Expression];
