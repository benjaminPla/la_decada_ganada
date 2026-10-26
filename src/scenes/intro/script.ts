import type { ChannelId } from "./channels";
import type { DialogLine, Speaker } from "../../ui/dialogBox";
import type { EndingId } from "../../progress/endings";
import { Expression } from "./types";
import { THEME } from "../../theme";

export type NodeId =
    | "c6n"
    | "c6n-tweet"
    | "cristina"
    | "kremlin"
    | "start"
    | "to-be-continued"
    | "tweet";

// expression sticks until a later line changes it
export type StoryLine = DialogLine & {
    expression?: Expression;
};

export type StoryChoice = {
    id:    string;
    label: string;
    next:  NodeId;
};

// non-empty tuple: the dialog box needs at least one line per node
export type StoryNode = {
    channel?: ChannelId;
    choices?: { options: readonly StoryChoice[]; prompt: StoryLine };
    ending?:  EndingId;
    lines:    readonly [StoryLine, ...StoryLine[]];
    next?:    NodeId;
};

export const SPEAKERS = {
    c6n:      { color: THEME.colors.alert,     name: "Víctor Hugo Inmorales (C6N)" },
    narrator: { color: THEME.colors.textMuted, name: "" },
    player:   { color: THEME.colors.text,      name: "Vos" },
    tn:       { color: THEME.colors.phosphor,  name: "TN - Todo Narrativa" },
} as const satisfies Record<string, Speaker>;

const { c6n, narrator, player, tn } = SPEAKERS;
const { Angry, Furious, Greedy, Sad, Shocked } = Expression;

export const START: NodeId = "start";

export const STORY: Record<NodeId, StoryNode> = {
    "c6n": {
        channel: "c6n",
        choices: {
            options: [
                { id: "tweet-angry",      label: "Tuitear con furia",     next: "c6n-tweet" },
                { id: "tweet-very-angry", label: "Tuitear con MÁS furia", next: "c6n-tweet" },
            ],
            prompt: { expression: Angry, speaker: player, text: "Esto no puede quedar así. Abro Y." },
        },
        lines: [
            { speaker: c6n,      text: "Buenas noches. Hoy, una noticia que debería preocuparnos a todos: la inflación fue de cero por ciento." },
            { speaker: c6n,      text: "¿Saben lo que significa? Que los precios ya no suben. ¿Y la tradición de remarcar? ¿Y el changuito lleno antes del aumento? Nos están robando la cultura." },
            { speaker: c6n,      text: "Encima el dólar no se mueve. Miles de arbolitos de la calle Florida, sin trabajo. ¿Quién piensa en ellos?" },
            { expression: Furious, speaker: player, text: "¡TIENE RAZÓN! ¡Nos están robando hasta la inflación!" },
            { speaker: narrator, text: "Te tiembla el ojo izquierdo. Agarrás el celular." },
        ],
    },
    "c6n-tweet": {
        choices: {
            options: [
                { id: "russia-accept", label: "Aceptar (es para la causa)", next: "kremlin" },
                { id: "russia-reject", label: "Rechazar",                   next: "kremlin" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "¿VEINTE DÓLARES? ¡Soy rico!" },
        },
        lines: [
            { speaker: narrator, text: "«ESTO ES UNA DICTADURA DEL SUPERÁVIT. DESPIERTEN.» Publicado a las 3:47 AM." },
            { expression: Greedy, speaker: narrator, text: "A la mañana tenés 40.000 seguidores. Te retuiteó Víctor Hugo Inmorales." },
            { speaker: narrator, text: "En un mes sos tendencia todos los días. En Y te dicen «el compañero de las 3 AM»." },
            { speaker: narrator, text: "Un día te escribe @Vladimir_Retuitov, desde Rusia: «Hola amigo. Pagamos 20 dólares por posteo. Es mucho dinero, ¿da?»." },
        ],
    },
    "cristina": {
        lines: [{ expression: Sad, speaker: narrator, text: "Visto 21:04. No contesta. Debe estar escribiendo otro libro." }],
        next:  "to-be-continued",
    },
    "kremlin": {
        ending: "kremlin-troll",
        lines:  [
            { expression: Greedy, speaker: narrator, text: "Ahora publicás lo que te mandan desde Moscú. Veinte dólares por posteo. Te sentís un oligarca." },
            { speaker: tn,       text: "ÚLTIMO MOMENTO: desbaratan una red de trolls pagados por Rusia. El más activo: «el compañero de las 3 AM»." },
            { expression: Shocked, speaker: player, text: "¡Es una operación de los medios hegemónicos!" },
            { expression: Sad, speaker: narrator, text: "Esta vez no. Esta vez era cierto." },
            { speaker: narrator, text: "Moscú no perdona a los que se queman. Esa noche, en el baño, alguien golpea la puerta." },
            { expression: Shocked, speaker: player, text: "¡OCUPADO!" },
            { speaker: narrator, text: "Un señor de traje y acento siberiano no espera." },
            { speaker: narrator, text: "Moriste como viviste: sentado, indignado y con el celular en la mano." },
        ],
    },
    "start": {
        choices: {
            options: [
                { id: "c6n",      label: "Cambiar a C6N",                next: "c6n" },
                { id: "tweet",    label: "Tuitear «ES TODO MENTIRA»",    next: "tweet" },
                { id: "cristina", label: "Escribirle a Cristina", next: "cristina" },
            ],
            prompt: { expression: Angry, speaker: player, text: "Tengo que hacer algo. Ya." },
        },
        lines: [
            { speaker: tn,     text: "ÚLTIMO MOMENTO: el gobierno de Javier Mileón anunció inflación del 0% por tercer mes consecutivo." },
            { speaker: tn,     text: "El riesgo país perfora mínimos históricos y el dólar... sigue quieto. Los analistas no lo pueden creer." },
            { expression: Shocked, speaker: player, text: "No. No, no, no. Esto es una operación de los medios hegemónicos." },
            { speaker: tn,     text: "Además, el INDEC confirmó que bajó la pobreza. Y publicó el dato." },
            { expression: Furious, speaker: player, text: "¡¿Publicó el dato?! ¿Adónde vamos a parar?" },
        ],
    },
    "to-be-continued": {
        lines: [{ speaker: narrator, text: "Continuará..." }],
    },
    "tweet": {
        lines: [{ expression: Sad, speaker: narrator, text: "Doce likes. Nueve son cuentas tuyas. El dólar sigue quieto igual." }],
        next:  "to-be-continued",
    },
};
