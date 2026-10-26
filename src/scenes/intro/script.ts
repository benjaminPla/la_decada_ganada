import type { ChannelId } from "./channels";
import type { DialogLine, Speaker } from "../../ui/dialogBox";
import type { EndingId } from "../../progress/endings";
import { Expression, type Stats } from "./types";
import { THEME } from "../../theme";

export type NodeId =
    | "activism"
    | "c6n"
    | "caught"
    | "councillor"
    | "cristina"
    | "cristina-audio"
    | "flotilla"
    | "fueros"
    | "greta"
    | "independent"
    | "kremlin"
    | "palestine"
    | "politics"
    | "quiet"
    | "russia-2"
    | "russia-3"
    | "san-jose"
    | "san-jose-cold"
    | "start"
    | "to-be-continued"
    | "troll"
    | "troll-raise"
    | "troll-settle"
    | "tweet"
    | "uruguay"
    | "vigil"
    | "viral"
    | "viral-2";

export type Condition = (stats: Readonly<Stats>) => boolean;

// expression sticks until a later line changes it
export type StoryLine = DialogLine & {
    expression?: Expression;
};

// hidden: options whose `when` fails are not shown
export type StoryChoice = {
    effects?: Partial<Stats>;
    id:       string;
    label:    string;
    next:     NodeId;
    when?:    Condition;
};

// first route whose `when` passes wins; a route without `when` is the fallback
export type StoryRoute = {
    next:  NodeId;
    when?: Condition;
};

// non-empty tuple: the dialog box needs at least one line per node
export type StoryNode = {
    channel?: ChannelId;
    choices?: { options: readonly StoryChoice[]; prompt: StoryLine };
    ending?:  EndingId;
    lines:    readonly [StoryLine, ...StoryLine[]];
    next?:    NodeId;
    route?:   readonly StoryRoute[];
};

export const SPEAKERS = {
    c6n:      { color: THEME.colors.alert,     name: "Víctor Hugo Inmorales (C6N)" },
    greta:    { color: THEME.colors.accent,    name: "Greta Thumbers" },
    narrator: { color: THEME.colors.textMuted, name: "" },
    player:   { color: THEME.colors.text,      name: "Vos" },
    tn:       { color: THEME.colors.phosphor,  name: "TN - Todo Narrativa" },
} as const satisfies Record<string, Speaker>;

const { c6n, greta, narrator, player, tn } = SPEAKERS;
const { Angry, Furious, Greedy, Sad, Shocked } = Expression;

// ---- thresholds

const CAUGHT_FAME_MONEY = 7;
const FLOTILLA_COMMUNISM = 5;
const FUEROS_PERONISM = 3;
const POLITICS_FAME = 7;
const URUGUAY_MONEY = 5;
const VIGIL_PERONISM = 7;

const TROLL_ROUTE: readonly StoryRoute[] = [
    { next: "caught", when: ({ fame, money }) => fame + money >= CAUGHT_FAME_MONEY },
    { next: "quiet" },
];

export const START: NodeId = "start";

export const STORY: Record<NodeId, StoryNode> = {
    "activism": {
        lines: [{ expression: Furious, speaker: narrator, text: "Vas a tres marchas en una semana. Llevás la kufiya hasta a la cancha." }],
        route: [
            { next: "greta", when: ({ communism }) => communism >= FLOTILLA_COMMUNISM },
            { next: "russia-2" },
        ],
    },
    "c6n": {
        channel: "c6n",
        choices: {
            options: [
                { effects: { anger: 1, fame: 2 }, id: "tweet-angry",      label: "Tuitear con furia",     next: "viral" },
                { effects: { anger: 3, fame: 3 }, id: "tweet-very-angry", label: "Tuitear con MÁS furia", next: "viral" },
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
    "caught": {
        channel: "tn",
        choices: {
            options: [
                { id: "caught-deny",    label: "Decir que te hackearon",   next: "kremlin" },
                { id: "caught-fueros",  label: "Afiliarte por los fueros", next: "fueros",  when: ({ peronism }) => peronism >= FUEROS_PERONISM },
                { id: "caught-uruguay", label: "Escaparte a Uruguay",      next: "uruguay", when: ({ money }) => money >= URUGUAY_MONEY },
            ],
            prompt: { expression: Shocked, speaker: player, text: "¿Y ahora qué hago?" },
        },
        lines: [
            { speaker: tn,       text: "ÚLTIMO MOMENTO: desbaratan una red de trolls pagados por Rusia. El más activo: «el compañero de las 3 AM»." },
            { expression: Shocked, speaker: player, text: "¡Es una operación de los medios hegemónicos!" },
            { expression: Sad, speaker: narrator, text: "Esta vez no. Esta vez era cierto." },
        ],
    },
    "councillor": {
        lines: [
            { expression: Greedy, speaker: narrator, text: "Jurás por Perón, por Evita y por los ñoquis presentes y futuros." },
            { speaker: narrator, text: "Tenés despacho, chofer y un primo nuevo en planta permanente." },
        ],
        next: "to-be-continued",
    },
    "cristina": {
        choices: {
            options: [
                { effects: { peronism: 2 },       id: "cristina-audio", label: "Mandarle un audio de 8 min", next: "cristina-audio" },
                { effects: { anger: 1, fame: 2 }, id: "cristina-vent",  label: "Desahogarte en Y",           next: "viral" },
            ],
            prompt: { speaker: player, text: "¿Le habrá llegado?" },
        },
        lines: [{ expression: Sad, speaker: narrator, text: "Visto 21:04. No contesta. Debe estar escribiendo otro libro." }],
    },
    "cristina-audio": {
        choices: {
            options: [
                { effects: { peronism: 3 },          id: "san-jose-go", label: "Ir a San José 1111",       next: "san-jose" },
                { effects: { fame: 1, peronism: 1 }, id: "volve-reina", label: "Tuitear «¡VOLVÉ, REINA!»", next: "viral" },
            ],
            prompt: { expression: Shocked, speaker: player, text: "¡Va a salir! ¡Me va a saludar a mí!" },
        },
        lines: [
            { expression: Sad, speaker: narrator, text: "Ocho minutos y doce segundos. Lloraste en el minuto cuatro." },
            { speaker: tn,       text: "ÚLTIMO MOMENTO: Cristina saldría esta noche al balcón de San José 1111." },
        ],
    },
    "flotilla": {
        ending: "flotilla",
        lines:  [
            { expression: Shocked, speaker: narrator, text: "Zarpás con la Flotilla de la Libertad. Greta va en la proa, con un cartel hecho a mano." },
            { speaker: greta,    text: "HOW DARE YOU!" },
            { speaker: narrator, text: "A los diez minutos los interceptan. A Greta la deportan a Suecia en primera clase. A vos, por error, te dejan pasar." },
            { expression: Furious, speaker: player, text: "¡Llegué! ¡Vengo a liberarlos!" },
            { speaker: narrator, text: "Desplegás la bandera del orgullo y el pañuelo verde. Todas las luchas son la misma lucha." },
            { expression: Shocked, speaker: narrator, text: "A los locales no les parece la misma lucha." },
            { speaker: narrator, text: "Te escondés en el único baño del barrio. Alguien golpea la puerta. No tiene acento siberiano, pero tampoco espera." },
            { speaker: narrator, text: "Moriste como viviste: sin leer la letra chica." },
        ],
    },
    "fueros": {
        lines: [
            { expression: Greedy, speaker: narrator, text: "Te afiliás el lunes. El martes sos concejal suplente. El miércoles tenés fueros." },
            { speaker: tn,       text: "El «troll del Kremlin» juró como concejal. «Es una persecución», declaró." },
            { speaker: player,   text: "Zafé." },
        ],
        next: "to-be-continued",
    },
    "greta": {
        choices: {
            options: [
                { effects: { communism: 2 }, id: "flotilla-board", label: "Subirte al barco",       next: "flotilla" },
                { id: "flotilla-skip",                              label: "Apoyar desde el sillón", next: "russia-2" },
            ],
            prompt: { expression: Shocked, speaker: player, text: "¿Yo? ¿En un barco?" },
        },
        lines: [{ speaker: narrator, text: "Te escribe Greta Thumbers: «Zarpamos a Gaza. Traé tu bandera y tu indignación»." }],
    },
    "independent": {
        lines: [{ expression: Angry, speaker: narrator, text: "Bloqueás a @Vladimir_Retuitov. Te sentís incorruptible. Te sentís Belgrano." }],
        route: [
            { next: "politics", when: ({ fame }) => fame >= POLITICS_FAME },
            { next: "to-be-continued" },
        ],
    },
    "kremlin": {
        ending: "kremlin-troll",
        lines:  [
            { speaker: narrator, text: "Moscú no perdona a los que se queman. Esa noche, en el baño, alguien golpea la puerta." },
            { expression: Shocked, speaker: player, text: "¡OCUPADO!" },
            { speaker: narrator, text: "Un señor de traje y acento siberiano no espera." },
            { speaker: narrator, text: "Moriste como viviste: sentado, indignado y con el celular en la mano." },
        ],
    },
    "palestine": {
        choices: {
            options: [
                { effects: { communism: 2 }, id: "kufiya",        label: "Ponerte una kufiya", next: "activism" },
                { effects: { anger: 1 },     id: "back-to-milei", label: "Volver a Mileón",    next: "russia-2" },
            ],
            prompt: { expression: Furious, speaker: player, text: "No alcanza. Tengo que hacer más." },
        },
        lines: [
            { speaker: narrator, text: "Cambiás la foto de perfil por una sandía. Tuiteás «FREE PALESTINE» desde el iPhone." },
            { speaker: narrator, text: "Te responden de todos lados. La mitad te dice genocida. La otra mitad también." },
        ],
    },
    "politics": {
        choices: {
            options: [
                { effects: { corruption: 3, money: 3, peronism: 2 }, id: "politics-accept", label: "Aceptar la banca",     next: "councillor" },
                { id: "politics-reject",                             label: "Seguir independiente", next: "to-be-continued" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "¿Concejal? ¿Con sueldo?" },
        },
        lines: [{ speaker: narrator, text: "Te llama un puntero: «Pibe, tenés más seguidores que el intendente. ¿Querés ser concejal?»." }],
    },
    "quiet": {
        lines: [
            { expression: Sad, speaker: narrator, text: "Sos un troll más entre millones. Nadie te nota. Ni Moscú." },
            { speaker: player,   text: "Veinte dólares por posteo... Bueno, algo es algo." },
        ],
        next: "to-be-continued",
    },
    "russia-2": {
        choices: {
            options: [
                { effects: { corruption: 3, money: 3 }, id: "russia-2-accept", label: "Aceptar (ahora sí)", next: "troll" },
                { effects: { fame: 1 },                 id: "russia-2-reject", label: "Rechazar otra vez",  next: "russia-3" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "Doscientos verdes..." },
        },
        lines: [{ speaker: narrator, text: "@Vladimir_Retuitov otra vez: «Amigo, subimos oferta. 200 dólares por posteo. Sin impuestos, ¿da?»." }],
    },
    "russia-3": {
        choices: {
            options: [
                { effects: { corruption: 3, money: 5 }, id: "russia-3-accept", label: "Aceptar (Sochi es lindo)", next: "troll" },
                { effects: { fame: 1 },                 id: "russia-3-reject", label: "Rechazar. Para siempre.",  next: "independent" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "Vista al mar..." },
        },
        lines: [{ speaker: narrator, text: "Último mensaje: «Departamento en Sochi con vista al mar. Y foto con Vladimir. El otro»." }],
    },
    "san-jose": {
        lines: [{ speaker: narrator, text: "Llegás a San José 1111. Hay bombos, choripanes y un señor que vende banderas en doce cuotas." }],
        route: [
            { next: "vigil", when: ({ peronism }) => peronism >= VIGIL_PERONISM },
            { next: "san-jose-cold" },
        ],
    },
    "san-jose-cold": {
        lines: [
            { expression: Sad, speaker: narrator, text: "A las dos horas tenés frío. A las tres, hambre. A las cuatro, el balcón sigue vacío." },
            { speaker: narrator, text: "En el colectivo de vuelta abrís Y." },
        ],
        next: "viral",
    },
    "start": {
        choices: {
            options: [
                { effects: { anger: 2 },          id: "c6n",      label: "Cambiar a C6N",             next: "c6n" },
                { effects: { anger: 1, fame: 1 }, id: "tweet",    label: "Tuitear «ES TODO MENTIRA»", next: "tweet" },
                { effects: { peronism: 2 },       id: "cristina", label: "Escribirle a Cristina",     next: "cristina" },
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
    "troll": {
        choices: {
            options: [
                { effects: { corruption: 1, money: 3 }, id: "troll-raise",  label: "Pedir aumento",  next: "troll-raise" },
                { id: "troll-settle",                                       label: "Estoy bien así", next: "troll-settle" },
            ],
            prompt: { expression: Greedy, speaker: narrator, text: "Vladimir pregunta si estás contento con el sueldo." },
        },
        lines: [{ expression: Greedy, speaker: narrator, text: "Ahora publicás lo que te mandan desde Moscú. Te sentís un oligarca." }],
    },
    "troll-raise": {
        lines: [{ expression: Greedy, speaker: narrator, text: "Vladimir acepta. Te paga el doble y te pide el triple." }],
        route: TROLL_ROUTE,
    },
    "troll-settle": {
        lines: [{ speaker: narrator, text: "Seguís cobrando lo mismo. Posteás en silencio, como un troll más." }],
        route: TROLL_ROUTE,
    },
    "tweet": {
        choices: {
            options: [
                { effects: { anger: 1, fame: 2 }, id: "tweet-insist",   label: "Insistir más fuerte",   next: "viral" },
                { effects: { peronism: 1 },       id: "tweet-cristina", label: "Escribirle a Cristina", next: "cristina" },
            ],
            prompt: { expression: Angry, speaker: player, text: "Ya van a ver." },
        },
        lines: [{ expression: Sad, speaker: narrator, text: "Doce likes. Nueve son cuentas tuyas. El dólar sigue quieto igual." }],
    },
    "uruguay": {
        lines: [
            { expression: Greedy, speaker: narrator, text: "Agarrás los dólares rusos y te tomás el Buquebus. En Colonia nadie te conoce." },
            { speaker: player,   text: "Zafé." },
            { speaker: narrator, text: "Por ahora." },
        ],
        next: "to-be-continued",
    },
    "vigil": {
        ending: "san-jose-vigil",
        lines:  [
            { expression: Furious, speaker: narrator, text: "No te vas. Un día, dos, nueve. Dormís en la vereda y comés lo que reparte la militancia." },
            { speaker: narrator, text: "El único baño es una fila de baños químicos. Ya los conocés por el nombre." },
            { expression: Shocked, speaker: narrator, text: "Día once. Se abre el balcón. Cristina saluda." },
            { speaker: player,   text: "¡ME MIRÓ! ¡ME MIRÓ A MÍ!" },
            { speaker: narrator, text: "La multitud salta. Vos estabas en el baño químico. El baño químico salta con ellos." },
            { speaker: narrator, text: "Y se da vuelta. Moriste como viviste: dando vueltas sobre lo mismo." },
        ],
    },
    "viral": {
        choices: {
            options: [
                { effects: { corruption: 2, money: 2 }, id: "russia-accept", label: "Aceptar (es para la causa)", next: "troll" },
                { effects: { fame: 1 },                 id: "russia-reject", label: "Rechazar",                   next: "viral-2" },
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
    "viral-2": {
        choices: {
            options: [
                { effects: { anger: 1, fame: 2, peronism: 1 }, id: "against-milei", label: "Contra Mileón",       next: "russia-2" },
                { effects: { communism: 3, fame: 1 },          id: "palestine",     label: "Por Palestina",       next: "palestine" },
                { effects: { anger: 2, fame: 3 },              id: "caps-4am",      label: "EN MAYÚSCULAS, 4 AM", next: "russia-2", when: ({ anger }) => anger >= 4 },
            ],
            prompt: { expression: Angry, speaker: player, text: "¿Y hoy contra quién tuiteo?" },
        },
        lines: [{ speaker: narrator, text: "Seguís gratis. Pasás los 200.000 seguidores. Te piden selfies en el chino." }],
    },
};
