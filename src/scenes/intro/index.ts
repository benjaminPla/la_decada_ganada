import { Button } from "../../ui/button";
import { DialogBox } from "../../ui/dialogBox";
import { type IntroLine, OPENINGS, type OpeningId, SCRIPTS } from "./script";
import { LAYOUT } from "./layout";
import type { Opening } from "./types";
import { PAUSE_KEY, bindAudioKeys } from "../../controls";
import Phaser from "phaser";
import { drawAsado } from "./asado";
import { drawChat } from "./chat";
import { drawFrame } from "./frame";
import { drawOffice } from "./office";
import { nextOpening } from "./rotation";
import { openPauseMenu } from "../menu/pause";
import { playMusic, playSfx } from "../../audio";

const DRAW: Record<OpeningId, (scene: Phaser.Scene) => Opening> = {
    asado:  drawAsado,
    chat:   drawChat,
    office: drawOffice,
};

// opening cinematic, a different one each run, then straight into the story
export class Intro extends Phaser.Scene {
    constructor() {
        super("Intro");
    }

    create() {
        const { skip } = LAYOUT;
        const id = nextOpening(OPENINGS);
        const opening = DRAW[id](this);
        const frame = drawFrame(this);
        const dialog = new DialogBox(this);
        const start = () => this.scene.start("Story");

        playMusic(this);
        dialog.on(DialogBox.LINE_EVENT, ({ beat, sfx }: IntroLine) => {
            if (sfx) {
                playSfx(this, sfx);
            }
            if (beat === "open" || beat === "fade") {
                frame[beat]();
            } else if (beat) {
                opening.play(beat);
            }
        });
        new Button(this, skip.x, skip.y, "Saltar", start, skip.width);
        this.input.keyboard!.on(PAUSE_KEY, () => openPauseMenu(this));
        bindAudioKeys(this);

        dialog.say(SCRIPTS[id], start);
    }
}
