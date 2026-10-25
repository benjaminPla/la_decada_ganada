import { LAYOUT as BUTTON } from "../../ui/button/layout";
import { THEME } from "../../theme";

export const LAYOUT = {
    back: {
        y: 0.85,
    },
    buttons: {
        gap: BUTTON.height + THEME.spacing.md,
        y:   0.43,
    },
    collection: {
        rowHeight: 56,
        section:   THEME.spacing.xl,
    },
    controls: {
        gap:       THEME.spacing.md,
        rowHeight: 48,
    },
    feedbackDuration: 1500,
    logo: {
        scale: 0.4,
        y:     0.22,
    },
    title: {
        y: 0.3,
    },
    volume: {
        offset: 170,
        size:   BUTTON.height,
    },
} as const;
