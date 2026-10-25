import type { DialogLine, Speaker } from "../../ui/dialogBox";
import { THEME } from "../../theme";

export const SPEAKERS = {
    c6n:      { color: THEME.colors.ink,       name: "C6N" },
    narrator: { color: THEME.colors.textMuted, name: "" },
    player:   { color: THEME.colors.text,      name: "Vos" },
    tn:       { color: THEME.colors.phosphor,  name: "TÑ - Todo Ñoticias" },
} as const satisfies Record<string, Speaker>;

const { c6n, narrator, player, tn } = SPEAKERS;

export const OPENING: readonly DialogLine[] = [
    { speaker: tn,     text: "ÚLTIMO MOMENTO: el gobierno de Javier Mileón anunció inflación del 0% por tercer mes consecutivo." },
    { speaker: tn,     text: "El riesgo país perfora mínimos históricos y el dólar... sigue quieto. Los analistas no lo pueden creer." },
    { speaker: player, text: "No. No, no, no. Esto es una operación de los medios hegemónicos." },
    { speaker: tn,     text: "Además, el INDEC confirmó que bajó la pobreza. Y esta vez publicó el dato." },
    { speaker: player, text: "¡¿Publicó el dato?! ¿Adónde vamos a parar?" },
];

export const PROMPT: DialogLine = { speaker: player, text: "Tengo que hacer algo. Ya." };

export const CHOICES = [
    {
        id:       "c6n",
        label:    "Cambiar a C6N",
        reaction: [{ speaker: c6n, text: "«Fuentes cercanas al compañero confirman que los números son falsos». Ah... qué paz." }],
    },
    {
        id:       "tweet",
        label:    "Tuitear «ES TODO MENTIRA»",
        reaction: [{ speaker: narrator, text: "Doce likes. Nueve son cuentas tuyas. El dólar sigue quieto igual." }],
    },
    {
        id:       "cristina",
        label:    "Escribirle a Cristina Fernet",
        reaction: [{ speaker: narrator, text: "Visto 21:04. No contesta. Debe estar escribiendo otro libro." }],
    },
] as const satisfies readonly { id: string; label: string; reaction: readonly DialogLine[] }[];

export const ENDING: readonly DialogLine[] = [
    { speaker: narrator, text: "Continuará..." },
];
