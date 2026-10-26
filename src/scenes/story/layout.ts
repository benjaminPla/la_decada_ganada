export const LAYOUT = {
    dildo: {
        band: 10,
        x:    530,
        y:    210,
    },
    flag: {
        height: 132,
        width:  220,
        x:      1030,
        y:      64,
    },
    marx: {
        x: 216,
        y: 420,
    },
    peronHands: {
        x: 440,
        y: 420,
    },
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
    shelf: {
        board:   10,
        columns: 3,
        height:  190,
        width:   480,
        x:       40,
        y:       330,
    },
    tv: {
        antenna:  72,
        casing:   { height: 320, radius: 24, x: 64, width: 480, y: 96 },
        flicker:  140,
        panel:    { width: 64 },
        place:    { scale: 0.75, x: 52, y: 18 },
        scanline: 4,
        screen:   { height: 256, inset: 32, radius: 16 },
        ticker:   2200,
    },
    wall: {
        baseboard: 24,
        stripe:    { every: 80, width: 8 },
    },
} as const;
