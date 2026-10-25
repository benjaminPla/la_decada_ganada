import { LAYOUT as BUTTON } from "../../ui/button/layout";
import { THEME } from "../../theme";

export const LAYOUT = {
    back: {
        y: 0.85,
    },
    buttons: {
        gap: BUTTON.height + THEME.spacing.md,
        y:   0.5,
    },
    feedbackDuration: 1500,
    logo: {
        scale: 0.45,
        y:     0.25,
    },
    title: {
        y: 0.3,
    },
    volume: {
        offset: 170,
        size:   BUTTON.height,
    },
} as const;
