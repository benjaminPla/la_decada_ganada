export const Expression = {
    Angry:   "angry",
    Furious: "furious",
    Greedy:  "greedy",
    Sad:     "sad",
    Shocked: "shocked",
} as const;

export type Expression = typeof Expression[keyof typeof Expression];
