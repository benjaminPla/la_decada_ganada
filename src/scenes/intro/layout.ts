export const LAYOUT = {
    poster: {
        height: 176,
        width:  136,
        x:      600,
        y:      72,
    },
    player: {
        scale: 7,
        shake: 2,
        x:     990,
        y:     540,
    },
    tv: {
        antenna:  72,
        cabinet:  { height: 120, x: 40, width: 528, y: 404 },
        casing:   { height: 320, radius: 24, x: 64, width: 480, y: 96 },
        flicker:  140,
        panel:    { width: 64 },
        scanline: 4,
        screen:   { height: 256, inset: 32, radius: 16 },
        ticker:   2200,
    },
    wall: {
        baseboard: 24,
        stripe:    { every: 80, width: 8 },
    },
} as const;
