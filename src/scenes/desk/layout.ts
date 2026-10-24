import { THEME } from "../../theme";

export const LAYOUT = {
    paper: {
        border: 4,
        height: 400,
        width:  500,
    },
    stamp: {
        border: 4,
        margin: THEME.spacing.xl,
        radius: 40,
    },
    titleOffset: THEME.spacing.lg,
} as const;
