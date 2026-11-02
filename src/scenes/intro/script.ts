import type { DialogLine, Speaker } from "../../ui/dialogBox";
import type { IntroBeat } from "./types";
import { SPEAKERS } from "../story/script";
import type { SfxId } from "../../audio";
import { THEME } from "../../theme";

export type IntroLine = DialogLine & {
    beat?: IntroBeat;
    sfx?:  SfxId;
};

export const OPENINGS = ["asado", "chat", "office"] as const;

export type OpeningId = typeof OPENINGS[number];

const family: Speaker = { color: THEME.colors.alert, name: "La familia" };
const therapist: Speaker = { color: THEME.colors.accent, name: "Lic. Graciela" };
const uncle: Speaker = { color: THEME.colors.ink, name: "Tío Carlos" };
const { narrator, player } = SPEAKERS;

const SETTING: IntroLine = { speaker: narrator, text: "Hace tres años que gobierna Javier Mileón." };
const TV: IntroLine = { speaker: narrator, text: "Te sentás frente a la tele, como todas las noches." };

export const SCRIPTS: Record<OpeningId, readonly IntroLine[]> = {
    asado: [
        SETTING,
        { beat: "open", speaker: narrator, text: "Domingo, 14 hs. Asado familiar en Castelar. El primero en años donde la carne no se paga en cuotas." },
        { beat: "saw", speaker: narrator, text: "Tu tío Carlos corta el vacío con una motosierra. Nadie le dice nada." },
        { speaker: uncle,    text: "¡ESTO ES LO QUE HAY QUE HACER CON EL ESTADO!" },
        { speaker: narrator, text: "Tu prima trae una ensalada. Silencio. Todos la miran." },
        { beat: "chant", sfx: "crowd", speaker: family, text: "¡AFUERA! ¡AFUERA! ¡AFUERA!" },
        { speaker: player,   text: "Es una ensalada de tomate..." },
        { speaker: uncle,    text: "Tomate, ministerio... es todo lo mismo, nene." },
        { beat: "bark", speaker: narrator, text: "El perro ladra tres veces. Jurarías que dice «a-fue-ra»." },
        { beat: "toast", speaker: uncle, text: "¡Brindemos por el superávit fiscal!" },
        { speaker: player,   text: "..." },
        { beat: "fade", speaker: narrator, text: "Volvés a casa. Te tomás el clonazepam. Te tomás otro." },
        TV,
    ],
    chat: [
        SETTING,
        { beat: "open", speaker: narrator, text: "Domingo, 23 hs. Grupo «Los pibes del secu». Catorce participantes. Activo desde 2009." },
        { beat: "next", sfx: "notify", speaker: narrator, text: "El Tano manda un sticker. Es un león." },
        { beat: "next", sfx: "notify", speaker: narrator, text: "Rulo manda el riesgo país. En mayúsculas." },
        { beat: "next", speaker: player, text: "Che, ¿nadie va a decir nada del ajuste?" },
        { beat: "next", speaker: narrator, text: "El Tano salió del grupo." },
        { beat: "next", speaker: narrator, text: "Rulo también." },
        { beat: "next", speaker: narrator, text: "Después, todos juntos. Como en el 2001, pero al revés." },
        { speaker: narrator, text: "Aparece un grupo nuevo: «Los pibes del secu (con león)». No te agregaron." },
        { beat: "next", speaker: player, text: "Bueno. Quedamos los que quedamos." },
        { speaker: narrator, text: "Quedan dos: vos y tu vieja. Nadie sabe quién la agregó." },
        { beat: "next", sfx: "notify", speaker: narrator, text: "Tu vieja reaccionó a tu mensaje. Con un león." },
        { beat: "next", speaker: narrator, text: "Tu vieja salió del grupo." },
        { speaker: player,   text: "..." },
        { beat: "fade", speaker: narrator, text: "Dejás el celular. Te tomás el clonazepam. Te tomás otro." },
        TV,
    ],
    office: [
        SETTING,
        { beat: "open", speaker: narrator, text: "Martes, 18 hs. Consultorio de la licenciada Graciela, en Palermo. Tu única hora de paz en la semana." },
        { beat: "write", speaker: therapist, text: "Bueno, contame. ¿Cómo venís?" },
        { speaker: player,    text: "Mal, Graciela. Todo anda bien." },
        { beat: "write", speaker: therapist, text: "Mhm. ¿Y eso qué te genera?" },
        { speaker: player,    text: "El domingo hubo asado. Los chicos brindaron por el superávit fiscal. Con Fernet." },
        { speaker: player,    text: "El Tano se tatuó un león. En la cara." },
        { speaker: player,    text: "Mi vieja consiguió turno en el médico para la semana que viene. LA SEMANA QUE VIENE, Graciela." },
        { beat: "write", speaker: therapist, text: "¿Y desde cuándo te sentís así?" },
        { speaker: player,    text: "Desde el 10 de diciembre de 2023. Me acuerdo dónde estaba. Estaba llorando." },
        { beat: "write", speaker: therapist, text: "Te subo el clonazepam: medio a la mañana, uno a la noche y dos si Mileón habla en cadena nacional." },
        { speaker: therapist, text: "Y dejá de mirar C6N." },
        { speaker: player,    text: "Es lo único que me queda, Graciela." },
        { sfx: "coins", speaker: therapist, text: "Bueno, se nos terminó la hora. Son 80 dólares." },
        { speaker: player,    text: "¿Dólares? ¿No eran pesos?" },
        { speaker: therapist, text: "Ahora es lo mismo, querido. Esa es la belleza del modelo." },
        { speaker: narrator,  text: "Te levantás. Arriba de la biblioteca hay una motosierra de peluche. ¿Estuvo siempre ahí?" },
        { beat: "fist", speaker: therapist, text: "¡Nos vemos el martes! ¡VIVA LA LIBERTAD, CARAJO!" },
        { speaker: player,    text: "..." },
        { beat: "fade", speaker: narrator, text: "Volvés a casa. Te tomás el clonazepam. Te tomás otro." },
        TV,
    ],
};
