import type { Beat } from "./deaths";
import type { ChannelId } from "./channels";
import type { DialogLine, Speaker } from "../../ui/dialogBox";
import type { EndingId } from "../../progress/endings";
import { Expression } from "./types";
import type { PlaceId } from "./places";
import type { SfxId } from "../../audio";
import type { Stats } from "../../stats";
import { THEME } from "../../theme";

export type NodeId =
    | "activism"
    | "c6n"
    | "campora"
    | "caught"
    | "councillor"
    | "cristina"
    | "cristina-audio"
    | "flotilla"
    | "fueros"
    | "greta"
    | "independent"
    | "independent-greta"
    | "kremlin"
    | "kremlin-spite"
    | "maximo"
    | "palestine"
    | "politics"
    | "quiet"
    | "russia-2"
    | "russia-3"
    | "san-jose"
    | "san-jose-cold"
    | "start"
    | "troll"
    | "troll-greta"
    | "troll-raise"
    | "troll-settle"
    | "troll-weeks"
    | "tweet"
    | "uruguay"
    | "vigil"
    | "vigil-days"
    | "vigil-exposed"
    | "vigil-fifa"
    | "vigil-maximo"
    | "vigil-paco"
    | "vigil-porro"
    | "vigil-ps5"
    | "vigil-toilet"
    | "viral"
    | "viral-2";

// doom: the ending the run is headed to; a later doom replaces it, nothing clears it
export type Run = {
    doom:  EndingId | null;
    stats: Stats;
};

export type Condition = (run: Readonly<Run>) => boolean;

// expression and place stick until a later line changes them; beat and sfx fire once as the line starts
export type StoryLine = DialogLine & {
    beat?:       Beat;
    expression?: Expression;
    place?:      PlaceId;
    sfx?:        SfxId;
};

// hidden: options whose `when` fails are not shown
export type StoryChoice = {
    doom?:    EndingId;
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
    greta:    { color: THEME.colors.accent,    name: "Greta Thunbarco" },
    maximo:   { color: THEME.colors.ink,       name: "Máximo" },
    narrator: { color: THEME.colors.textMuted, name: "" },
    paco:     { color: THEME.colors.accent,    name: "Padre Paco" },
    player:   { color: THEME.colors.text,      name: "Vos" },
    tn:       { color: THEME.colors.phosphor,  name: "TN - Todo Narrativa" },
} as const satisfies Record<string, Speaker>;

const { c6n, greta, maximo, narrator, paco, player, tn } = SPEAKERS;
const { Angry, Dead, Furious, Greedy, Happy, Sad, Shocked, Smug } = Expression;

// ---- thresholds

const CAUGHT_FAME_MONEY = 7;
const FLOTILLA_PALESTINE = 5;
const FUEROS_PERONISM = 3;
const POLITICS_FAME = 7;
const URUGUAY_MONEY = 5;
const VIGIL_PERONISM = 7;

const isDoomed = (ending: EndingId): Condition => ({ doom }) => doom === ending;

const TROLL_ROUTE: readonly StoryRoute[] = [
    { next: "caught", when: ({ stats: { fame, money } }) => fame + money >= CAUGHT_FAME_MONEY },
    { next: "quiet" },
];

export const START: NodeId = "start";

export const STORY: Record<NodeId, StoryNode> = {
    "activism": {
        lines: [{ expression: Furious, speaker: narrator, text: "Vas a tres marchas en una semana: Palestina, el orgullo y una que no entendiste." }],
        route: [
            { next: "greta", when: ({ stats: { palestine } }) => palestine >= FLOTILLA_PALESTINE },
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
    "campora": {
        lines: [
            { sfx: "notify", speaker: narrator, text: "Te escribe La Cámpora: «Compañero, tu primera tarea: bancar la vigilia en San José 1111. Hasta que salga»." },
            { place: "san-jose", sfx: "crowd", speaker: narrator, text: "Ni te pregunta. Esa misma noche estás en la vereda con un bombo prestado." },
        ],
        next: "vigil-paco",
    },
    "caught": {
        channel: "tn",
        choices: {
            options: [
                { id: "caught-deny",                           label: "Decir que te hackearon",   next: "kremlin" },
                { doom: "san-jose-vigil", id: "caught-fueros", label: "Afiliarte por los fueros", next: "fueros",  when: ({ stats: { peronism } }) => peronism >= FUEROS_PERONISM },
                { id: "caught-uruguay",                        label: "Escaparte a Uruguay",      next: "uruguay", when: ({ stats: { money } }) => money >= URUGUAY_MONEY },
            ],
            prompt: { expression: Shocked, speaker: player, text: "¿Y ahora qué hago?" },
        },
        lines: [
            { speaker: tn,       text: "ÚLTIMO MOMENTO: desbaratan una red de trolls pagados por Rusia. El más activo: «Klonazepam»." },
            { expression: Shocked, speaker: player, text: "¡Es una operación de los medios hegemónicos!" },
            { expression: Sad, speaker: narrator, text: "Esta vez no. Esta vez era cierto." },
        ],
    },
    "councillor": {
        lines: [
            { expression: Smug, speaker: narrator, text: "Jurás por Perón, por Evita y por los ñoquis presentes y futuros." },
            { speaker: narrator, text: "Tenés despacho, chofer y un primo nuevo en planta permanente." },
        ],
        next: "campora",
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
            prompt: { expression: Happy, speaker: player, text: "¡Va a salir! ¡Me va a saludar a mí!" },
        },
        lines: [
            { expression: Sad, speaker: narrator, text: "Ocho minutos y doce segundos. Lloraste en el minuto cuatro." },
            { speaker: tn,       text: "ÚLTIMO MOMENTO: Cristina saldría esta noche al balcón de San José 1111." },
        ],
    },
    "flotilla": {
        ending: "flotilla",
        lines:  [
            { expression: Shocked, place: "boat", sfx: "waves", speaker: narrator, text: "Zarpás con la Flotilla de la Libertad. Greta va en la proa, con un cartel hecho a mano." },
            { speaker: greta,    text: "HOW DARE YOU!" },
            { speaker: narrator, text: "A los diez minutos los interceptan. A Greta la deportan a Suecia en primera clase. A vos, por error, te dejan pasar." },
            { expression: Happy, place: "gaza", speaker: player, text: "¡Llegué! ¡Vengo a liberarlos!" },
            { speaker: narrator, text: "Desplegás la bandera del orgullo y el pañuelo verde. Todas las luchas son la misma lucha." },
            { expression: Shocked, speaker: narrator, text: "A los locales no les parece la misma lucha." },
            { place: "gaza-bathroom", speaker: narrator, text: "Te escondés en el único baño del barrio. Ya que estás, te sentás." },
            { place: "death-gaza", speaker: narrator, text: "Abrís las noticias: «Gana la derecha en Chile». «Y en Honduras». Te sale todo junto." },
            { sfx: "knock", speaker: narrator, text: "Golpean la puerta. Muchos puños." },
            { beat: "enter", speaker: narrator, text: "Entran varios. Fusiles, caras tapadas. Miran tu bandera del orgullo. Te miran a vos." },
            { beat: "aim", expression: Shocked, speaker: player, text: "¡Pero yo vine a apoyarlos! ¡Tengo la remera!" },
            { beat: "bang", expression: Dead, sfx: "burst", speaker: narrator, text: "Moriste como viviste: sin leer la letra chica." },
        ],
    },
    "fueros": {
        lines: [
            { expression: Smug, speaker: narrator, text: "Te afiliás el lunes. El martes sos concejal suplente. El miércoles tenés fueros." },
            { speaker: tn,       text: "El «troll del Kremlin» juró como concejal. «Es una persecución», declaró." },
            { expression: Smug, speaker: player, text: "Zafé." },
        ],
        next: "campora",
    },
    "greta": {
        choices: {
            options: [
                { effects: { lgbt: 3, palestine: 2 }, id: "flotilla-board", label: "Subirte al barco",       next: "flotilla" },
                { id: "flotilla-skip",                                       label: "Apoyar desde el sillón", next: "russia-2" },
            ],
            prompt: { expression: Shocked, speaker: player, text: "¿Yo? ¿En un barco?" },
        },
        lines: [{ speaker: narrator, text: "Te escribe Greta Thunbarco: «Zarpamos a Gaza. Traé tu bandera y tu indignación»." }],
    },
    "independent": {
        lines: [{ expression: Smug, speaker: narrator, text: "Bloqueás a @Vladimir_Putazo. Te sentís incorruptible. Te sentís Belgrano." }],
        route: [
            { next: "politics", when: ({ stats: { fame } }) => fame >= POLITICS_FAME },
            { next: "independent-greta" },
        ],
    },
    "independent-greta": {
        choices: {
            options: [
                { doom: "flotilla", effects: { lgbt: 3, palestine: 2 }, id: "independent-board",  label: "Subirte al barco",         next: "flotilla" },
                { effects: { fame: 1 },                                 id: "independent-refuse", label: "Rechazar a Greta también", next: "kremlin-spite" },
            ],
            prompt: { expression: Shocked, speaker: player, text: "¿Yo? ¿En un barco?" },
        },
        lines: [{ sfx: "notify", speaker: narrator, text: "Te escribe Greta Thunbarco: «Vi que le dijiste que no a Rusia. Zarpamos a Gaza. Necesitamos gente incorruptible»." }],
    },
    "kremlin": {
        ending: "kremlin-troll",
        lines:  [
            { expression: Sad, place: "bathroom", speaker: narrator, text: "Moscú no perdona. Esa noche no podés dormir y vas al baño con el celular, como todo hombre de bien." },
            { place: "death-home", speaker: narrator, text: "Sentado en el inodoro, scrolleás: «Bolivia elige un presidente de derecha después de veinte años»." },
            { speaker: narrator, text: "«Chile también». Pujás con bronca." },
            { sfx: "knock", speaker: narrator, text: "Alguien golpea la puerta." },
            { expression: Shocked, speaker: player, text: "¡OCUPADO!" },
            { beat: "enter", speaker: narrator, text: "La puerta se abre igual. Un señor de traje y gorro de piel entra sin apuro." },
            { beat: "aim", speaker: narrator, text: "«Vladimir manda saludos. Y quiere sus veinte dólares de vuelta»." },
            { beat: "bang", expression: Dead, sfx: "gunshot", speaker: narrator, text: "Moriste como viviste: sentado, indignado y con el celular en la mano." },
        ],
    },
    "kremlin-spite": {
        ending: "kremlin-troll",
        lines:  [
            { sfx: "notify", speaker: narrator, text: "@Vladimir_Putazo: «Amigo, le dijiste que no a Rusia tres veces. Eso no es bueno para la salud, ¿da?»." },
            { expression: Smug, speaker: player, text: "Soy incorruptible." },
            { expression: Sad, place: "bathroom", speaker: narrator, text: "Esa noche no podés dormir y vas al baño con el celular, como todo hombre de bien." },
            { place: "death-home", speaker: narrator, text: "Sentado en el inodoro, scrolleás: «Bolivia elige un presidente de derecha después de veinte años»." },
            { speaker: narrator, text: "«Chile también». Pujás con bronca." },
            { sfx: "knock", speaker: narrator, text: "Alguien golpea la puerta." },
            { expression: Shocked, speaker: player, text: "¡OCUPADO!" },
            { beat: "enter", speaker: narrator, text: "La puerta se abre igual. Un señor de traje y gorro de piel entra sin apuro." },
            { beat: "aim", speaker: narrator, text: "«Vladimir manda saludos. Dice que a Vladimir no se le dice que no»." },
            { beat: "bang", expression: Dead, sfx: "gunshot", speaker: narrator, text: "Moriste como viviste: diciendo que no a todo." },
        ],
    },
    "maximo": {
        ending: "maximo",
        lines:  [
            { place: "death-chemical", speaker: narrator, text: "Sentado, abrís las noticias: «Mileón elimina los impuestos a la electrónica. La Play 5 sale la mitad»." },
            { speaker: narrator, text: "Pujás con bronca." },
            { sfx: "knock", speaker: narrator, text: "Golpean la puerta del baño químico. Un solo golpe." },
            { beat: "enter", speaker: narrator, text: "Es Máximo. Tiene la Play rota abajo del brazo." },
            { expression: Shocked, speaker: player, text: "¡Era un golazo, Máximo! ¡Era un golazo!" },
            { beat: "aim", speaker: narrator, text: "Todo se pone azul. A Máximo se le prenden los ojos. A vos también. No sabés por qué." },
            { beat: "bang", expression: Dead, sfx: "gunshot", speaker: narrator, text: "Moriste como viviste: festejando antes de tiempo." },
        ],
    },
    "palestine": {
        choices: {
            options: [
                { effects: { communism: 1, palestine: 2 },          id: "kufiya",        label: "Ponerte una kufiya", next: "activism" },
                { effects: { communism: 1, lgbt: 2, palestine: 2 }, id: "march-all",     label: "Marchar por todo",   next: "activism" },
                { effects: { anger: 1 },                            id: "back-to-milei", label: "Volver a Mileón",    next: "russia-2" },
            ],
            prompt: { expression: Furious, speaker: player, text: "No alcanza. Tengo que hacer más." },
        },
        lines: [
            { sfx: "notify", speaker: narrator, text: "Cambiás la foto de perfil por una sandía. Tuiteás «FREE PALESTINE» desde el iPhone." },
            { speaker: narrator, text: "Te responden de todos lados. La mitad te dice genocida. La otra mitad también." },
        ],
    },
    "politics": {
        choices: {
            options: [
                { doom: "san-jose-vigil", effects: { corruption: 3, money: 3, peronism: 2 }, id: "politics-accept", label: "Aceptar la banca",     next: "councillor" },
                { id: "politics-reject",                                                                            label: "Seguir independiente", next: "independent-greta" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "¿Concejal? ¿Con sueldo?" },
        },
        lines: [{ speaker: narrator, text: "Te llama un puntero: «Pibe, tenés más seguidores que el intendente. ¿Querés ser concejal?»." }],
    },
    "quiet": {
        lines: [
            { expression: Sad, speaker: narrator, text: "Sos un troll más entre millones. Nadie te nota. Ni Moscú." },
            { expression: Sad, speaker: player, text: "Veinte dólares por posteo... Bueno, algo es algo." },
            { speaker: narrator, text: "Hasta que Moscú hace recorte de personal. En Moscú los despidos son definitivos." },
        ],
        next: "kremlin",
    },
    "russia-2": {
        choices: {
            options: [
                { effects: { corruption: 3, money: 3 }, id: "russia-2-accept", label: "Aceptar (ahora sí)", next: "troll" },
                { effects: { fame: 1 },                 id: "russia-2-reject", label: "Rechazar otra vez",  next: "russia-3" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "Doscientos verdes..." },
        },
        lines: [{ sfx: "notify", speaker: narrator, text: "@Vladimir_Putazo otra vez: «Amigo, subimos oferta. 200 dólares por posteo. Sin impuestos, ¿da?»." }],
    },
    "russia-3": {
        choices: {
            options: [
                { effects: { corruption: 3, money: 5 }, id: "russia-3-accept", label: "Aceptar (Sochi es lindo)", next: "troll" },
                { effects: { fame: 1 },                 id: "russia-3-reject", label: "Rechazar. Para siempre.",  next: "independent" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "Vista al mar..." },
        },
        lines: [{ sfx: "notify", speaker: narrator, text: "Último mensaje: «Departamento en Sochi con vista al mar. Y foto con Vladimir. El otro»." }],
    },
    "san-jose": {
        choices: {
            options: [
                { doom: "san-jose-vigil", effects: { peronism: 2 }, id: "vigil-stay",                        label: "Quedarte hasta que salga", next: "vigil-paco", when: ({ stats: { peronism } }) => peronism >= VIGIL_PERONISM },
                { doom: "kremlin-troll",  effects: { corruption: 3, fame: 2, money: 5 }, id: "vigil-stream", label: "Transmitir para Vladimir", next: "vigil-paco" },
                { id: "san-jose-leave",                                                                      label: "Volverte a casa",          next: "san-jose-cold" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "Quinientos dólares por mirar un balcón..." },
        },
        lines: [
            { place: "san-jose", sfx: "crowd", speaker: narrator, text: "Llegás a San José 1111. Hay bombos, choripanes y un señor que vende banderas en doce cuotas." },
            { sfx: "notify", speaker: narrator, text: "Te escribe un tal @Vladimir_Putazo: «Amigo, transmití la vigilia en vivo. 500 dólares. La cámara la ponemos nosotros, ¿da?»." },
        ],
    },
    "san-jose-cold": {
        lines: [
            { expression: Sad, speaker: narrator, text: "A las dos horas tenés frío. A las tres, hambre. A las cuatro, el balcón sigue vacío." },
            { place: "room", speaker: narrator, text: "En el colectivo de vuelta abrís Y." },
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
    "troll": {
        choices: {
            options: [
                { effects: { corruption: 1, money: 3 }, id: "troll-raise",  label: "Pedir aumento",  next: "troll-raise" },
                { id: "troll-settle",                                       label: "Estoy bien así", next: "troll-settle" },
            ],
            prompt: { expression: Greedy, speaker: narrator, text: "Vladimir pregunta si estás contento con el sueldo." },
        },
        lines: [{ expression: Greedy, sfx: "coins", speaker: narrator, text: "Ahora publicás lo que te mandan desde Moscú. Te sentís un oligarca." }],
    },
    "troll-greta": {
        choices: {
            options: [
                { doom: "flotilla", effects: { lgbt: 3, palestine: 2 }, id: "troll-board", label: "Pagarte el barco con plata rusa", next: "flotilla" },
                { id: "troll-keep",                                                         label: "Seguir posteando para Moscú",     next: "troll-weeks" },
            ],
            prompt: { expression: Greedy, speaker: player, text: "Con la plata rusa me pago el pasaje..." },
        },
        lines: [{ sfx: "notify", speaker: narrator, text: "Entre posteo y posteo te aparece un video de Greta Thunbarco: «Zarpamos a Gaza. Faltan voluntarios. HOW DARE YOU!»." }],
    },
    "troll-raise": {
        lines: [{ expression: Greedy, sfx: "coins", speaker: narrator, text: "Vladimir acepta. Te paga el doble y te pide el triple." }],
        next: "troll-greta",
    },
    "troll-settle": {
        lines: [{ speaker: narrator, text: "Seguís cobrando lo mismo. Posteás en silencio, como un troll más." }],
        next: "troll-greta",
    },
    "troll-weeks": {
        lines: [{ speaker: narrator, text: "Pasan las semanas. Posteás, cobrás, posteás." }],
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
        lines: [{ expression: Sad, sfx: "notify", speaker: narrator, text: "Doce likes. Nueve son cuentas tuyas. El dólar sigue quieto igual." }],
    },
    "uruguay": {
        lines: [
            { expression: Greedy, place: "colonia", sfx: "waves", speaker: narrator, text: "Agarrás los dólares rusos y te tomás el Buquebus. En Colonia nadie te conoce." },
            { expression: Happy, speaker: player, text: "Zafé." },
            { speaker: narrator, text: "Por ahora." },
            { speaker: narrator, text: "Al mes subís una foto: «Atardecer en Colonia». Con ubicación." },
        ],
        next: "kremlin",
    },
    "vigil": {
        ending: "san-jose-vigil",
        lines:  [
            { place: "death-chemical", speaker: narrator, text: "Sentado, abrís las noticias: «El Congreso aprueba el presupuesto de Mileón. Con votos peronistas»." },
            { speaker: narrator, text: "Pujás con bronca." },
            { beat: "shake", sfx: "crowd", speaker: narrator, text: "Afuera, un rugido. Se abrió el balcón. Cristina saluda." },
            { expression: Shocked, speaker: player, text: "¡NO! ¡AHORA NO! ¡ESPERÁ, REINA, YA SALGO!" },
            { beat: "shake", sfx: "crowd", speaker: narrator, text: "La multitud salta. Diez mil peronistas. El baño químico salta con ellos." },
            { beat: "shake", speaker: narrator, text: "«¡VAMOS A VOLVER!» Saltan más alto. El bombo retumba en el inodoro." },
            { beat: "tip", expression: Dead, sfx: "crash", speaker: narrator, text: "Y se da vuelta. Moriste como viviste: dando vueltas sobre lo mismo." },
        ],
    },
    "vigil-days": {
        lines: [{ expression: Sad, speaker: narrator, text: "Día diez. Cristina no sale. Vos tampoco." }],
        route: [
            { next: "vigil-exposed", when: isDoomed("kremlin-troll") },
            { next: "vigil-toilet" },
        ],
    },
    "vigil-exposed": {
        lines: [
            { sfx: "notify", speaker: tn, text: "ÚLTIMO MOMENTO: un troll del Kremlin estaba infiltrado en la vigilia de San José 1111." },
            { expression: Shocked, speaker: player, text: "¿Cómo se enteraron?" },
            { place: "room", speaker: narrator, text: "La militancia te reconoce. Corrés las treinta cuadras hasta tu casa sin mirar atrás." },
        ],
        next: "kremlin",
    },
    "vigil-fifa": {
        choices: {
            options: [
                { effects: { corruption: 1, peronism: 2 }, id: "fifa-lose", label: "Dejarlo ganar",    next: "vigil-days" },
                { doom: "maximo", effects: { anger: 3 }, id: "fifa-goal",   label: "Gritar el octavo", next: "vigil-ps5" },
            ],
            prompt: { expression: Smug, speaker: player, text: "Uno más y lo humillo." },
        },
        lines: [
            { speaker: narrator, text: "Él elige Argentina. A vos te deja Brasil. Al minuto ochenta vas siete a cero." },
            { speaker: maximo,   text: "Dale que todavía se da vuelta." },
        ],
    },
    "vigil-maximo": {
        choices: {
            options: [
                { id: "fifa-play",                                                                 label: "Jugar al FIFA con Máximo",  next: "vigil-fifa" },
                { doom: "kremlin-troll", effects: { corruption: 2, money: 5 }, id: "maximo-photo", label: "Sacarle la foto a Máximo",  next: "vigil-days" },
                { effects: { peronism: 1 },                                    id: "vigil-sing",   label: "Seguir cantando la marcha", next: "vigil-days" },
            ],
            prompt: { expression: Happy, speaker: player, text: "¿Una Play? ¿En la vigilia?" },
        },
        lines: [
            { speaker: narrator, text: "Día nueve. Baja Máximo con una Play 5 y un generador. «Para bancar la vigilia», dice." },
            { speaker: maximo,   text: "¿Quién se juega un FIFA? Yo soy Argentina." },
            { sfx: "notify", speaker: narrator, text: "Te vibra el celular. @Vladimir_Putazo: «Amigo, foto de Máximo con la Play. 1.000 dólares»." },
        ],
    },
    "vigil-paco": {
        choices: {
            options: [
                { effects: { anger: -2 },   id: "paco-accept", label: "Aceptar el porro bendito", next: "vigil-porro" },
                { effects: { peronism: 1 }, id: "paco-pray",   label: "Rezar un Padre Nuestro",   next: "vigil-maximo" },
            ],
            prompt: { expression: Shocked, speaker: player, text: "¿Eso es lo que creo que es?" },
        },
        lines: [
            { expression: Furious, speaker: narrator, text: "No te vas. Un día, dos, ocho. Dormís en la vereda y comés lo que reparte la militancia." },
            { speaker: narrator, text: "El único baño es una fila de baños químicos. Ya los conocés por el nombre." },
            { speaker: paco,     text: "Hijo, tomá un guiso. Y esto, que es medicinal. Lo bendije yo." },
        ],
    },
    "vigil-porro": {
        lines: [
            { expression: Happy, speaker: narrator, text: "Ves a Perón en una nube. Te guiña un ojo. Le pedís un plan." },
            { speaker: player, text: "Padre... ¿usted cree que hoy sale?" },
            { speaker: paco,   text: "Hijo, yo ya no creo en nada. Pasame el encendedor." },
        ],
        next: "vigil-maximo",
    },
    "vigil-ps5": {
        lines: [
            { expression: Furious, sfx: "crowd", speaker: player, text: "¡GOOOOOL! ¡OCHO A CERO!" },
            { expression: Shocked, sfx: "crash", speaker: narrator, text: "Saltás, enganchás el cable del generador y la Play vuela. Rebota en un bombo y cae de cara al asfalto." },
            { speaker: narrator, text: "Máximo no dice nada. Junta los pedazos y se va. Te mira una sola vez." },
        ],
        next: "vigil-days",
    },
    "vigil-toilet": {
        lines: [{ speaker: narrator, text: "Día once. Te agarra la urgencia. Entrás al de siempre: el tercero." }],
        route: [
            { next: "maximo", when: isDoomed("maximo") },
            { next: "vigil" },
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
            { place: "room", sfx: "notify", speaker: narrator, text: "«ESTO ES UNA DICTADURA DEL SUPERÁVIT. DESPIERTEN.» Publicado a las 3:47 AM." },
            { expression: Greedy, speaker: narrator, text: "A la mañana tenés 40.000 seguidores. Te retuiteó Víctor Hugo Inmorales." },
            { speaker: narrator, text: "En un mes sos tendencia todos los días. En Y te dicen «Klonazepam»." },
            { speaker: narrator, text: "Un día te escribe @Vladimir_Putazo, desde Rusia: «Hola amigo. Pagamos 20 dólares por posteo. Es mucho dinero, ¿da?»." },
        ],
    },
    "viral-2": {
        choices: {
            options: [
                { effects: { anger: 1, fame: 2, peronism: 1 },      id: "against-milei", label: "Contra Mileón",       next: "russia-2" },
                { effects: { communism: 1, fame: 1, palestine: 3 }, id: "palestine",     label: "Por Palestina",       next: "palestine" },
                { effects: { anger: 2, fame: 3 },                   id: "caps-4am",      label: "EN MAYÚSCULAS, 4 AM", next: "russia-2", when: ({ stats: { anger } }) => anger >= 4 },
            ],
            prompt: { expression: Angry, speaker: player, text: "¿Y hoy contra quién tuiteo?" },
        },
        lines: [{ speaker: narrator, text: "Seguís gratis. Pasás los 200.000 seguidores. Te piden selfies en el chino." }],
    },
};
