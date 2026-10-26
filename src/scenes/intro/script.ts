import type { DialogLine, Speaker } from "../../ui/dialogBox";
import type { OfficeBeat } from "./office";
import { SPEAKERS } from "../story/script";
import type { SfxId } from "../../audio";
import { THEME } from "../../theme";

export type IntroLine = DialogLine & {
    beat?: OfficeBeat;
    sfx?:  SfxId;
};

const therapist: Speaker = { color: THEME.colors.accent, name: "Lic. Graciela" };
const { narrator, player } = SPEAKERS;

export const LINES: readonly IntroLine[] = [
    { speaker: narrator,  text: "Hace tres años que gobierna Javier Mileón." },
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
    { speaker: narrator,  text: "Te sentás frente a la tele, como todas las noches." },
];
