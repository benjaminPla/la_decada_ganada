import Phaser from "phaser";

export const THEME = {
    colors: {
        accent:      0x74acdf,
        alert:       0xff6b6b,
        background:  0x281e19,
        ink:         0xc81828,
        paperBorder: 0x4c3f2f,
        phosphor:    0x6fdc6f,
        surface:     0x1a1310,
        text:        0xffffff,
        textMuted:   0x6e625a,
    },
    fontSizes: {
        lg: 28,
        md: 22,
        sm: 16,
        xl: 40,
    },
    fonts: {
        ui: "pixelify",
    },
    spacing: {
        lg: 32,
        md: 16,
        sm: 8,
        xl: 64,
    },
} as const;

type Color    = keyof typeof THEME.colors;
type Font     = keyof typeof THEME.fonts;
type FontSize = keyof typeof THEME.fontSizes;

export function toCss(color: number): string {
    return `#${color.toString(16).padStart(6, "0")}`;
}

export function textStyle(font: Font, size: FontSize, color: Color = "text"): Phaser.Types.GameObjects.Text.TextStyle {
    return {
        color:      toCss(THEME.colors[color]),
        fontFamily: THEME.fonts[font],
        fontSize:   `${THEME.fontSizes[size]}px`,
    };
}
