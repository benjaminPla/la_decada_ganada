import { THEME } from "../../theme";

export const LAYOUT = {
    bar: {
        border:  2,
        height:  20,
        padding: 2,
        width:   400,
        y:       0.76,
    },
    logo: {
        introDuration: 350,
        introScale:    1.2,
        scale:         0.6,
        y:             0.375,
    },
    messageOffset: THEME.spacing.xl - THEME.spacing.sm,
} as const;
