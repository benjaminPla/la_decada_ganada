import { THEME } from "../../theme";

export type TvChannel = {
    bar:      number;
    chart:    readonly number[];
    color:    number;
    headline: string;
    name:     string;
    screen:   number;
    stat:     string;
    ticker:   readonly string[];
};

// same chart on both channels: only the spin changes
const RISING = [0.15, 0.22, 0.18, 0.32, 0.4, 0.36, 0.55, 0.62, 0.58, 0.78, 0.95];

export const CHANNELS = {
    c6n: {
        bar:      0x3a0d10,
        chart:    RISING,
        color:    THEME.colors.alert,
        headline: "ALERTA: LOS PRECIOS NO SUBEN",
        name:     "C6N",
        screen:   0x160809,
        stat:     "▲ PELIGRO",
        ticker:   [
            "V. H. INMORALES EN VIVO",
            "¿Y SI LA ESTABILIDAD ES UNA TRAMPA?",
            "ARBOLITOS DE FLORIDA, SIN TRABAJO",
            "EXPERTOS: «EXTRAÑAMOS EL 200%»",
        ],
    },
    tn: {
        bar:      0x113a1c,
        chart:    RISING,
        color:    THEME.colors.phosphor,
        headline: "MILEÓN: INFLACIÓN 0%",
        name:     "TN",
        screen:   0x0b1a0f,
        stat:     "▲ +38%",
        ticker:   [
            "RIESGO PAÍS ▼ MÍNIMO HISTÓRICO",
            "DÓLAR: QUIETO HACE 14 MESES",
            "SUPERÁVIT FISCAL ▲ OTRA VEZ",
            "MERVAL ▲ +12% EN EL DÍA",
        ],
    },
} as const satisfies Record<string, TvChannel>;

export type ChannelId = keyof typeof CHANNELS;
