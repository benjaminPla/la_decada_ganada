// script lines fire beats; open and fade belong to the frame, each opening plays the rest it knows
export type IntroBeat = "bark" | "chant" | "fade" | "fist" | "next" | "open" | "saw" | "toast" | "write";

export type Opening = {
    play: (beat: IntroBeat) => void;
};
