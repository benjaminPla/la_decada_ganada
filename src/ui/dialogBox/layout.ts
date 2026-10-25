import { THEME } from "../../theme";

export const LAYOUT = {
    border: 4,
    choice: {
        gap:   THEME.spacing.md,
        width: 380,
    },
    height:    200,
    hintBlink: 500,
    padding:   THEME.spacing.lg,
    typeDelay: 28,
} as const;
