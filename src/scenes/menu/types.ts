export const View = {
    Collection: "collection",
    Controls:   "controls",
    Credits:    "credits",
    Main:       "main",
    Settings:   "settings",
} as const;

export type View = typeof View[keyof typeof View];

export type MenuData = {
    from?:   string;
    paused?: boolean;
    view?:   View;
};
