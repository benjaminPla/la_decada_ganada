export const View = {
    Credits:  "credits",
    Main:     "main",
    Settings: "settings",
} as const;

export type View = typeof View[keyof typeof View];

export type MenuData = {
    paused?: boolean;
    view?:   View;
};
