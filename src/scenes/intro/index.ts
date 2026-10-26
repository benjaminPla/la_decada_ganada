import { Button } from "../../ui/button";
import { DialogBox } from "../../ui/dialogBox";
import { type IntroLine, LINES } from "./script";
import { LAYOUT } from "./layout";
import { PAUSE_KEY, bindAudioKeys } from "../../controls";
import Phaser from "phaser";
import { drawOffice } from "./office";
import { openPauseMenu } from "../menu/pause";
import { playMusic, playSfx } from "../../audio";

// opening cinematic: the therapy session, then straight into the story
export class Intro extends Phaser.Scene {
    constructor() {
        super("Intro");
    }

    create() {
        const { skip } = LAYOUT;
        const office = drawOffice(this);
        const dialog = new DialogBox(this);
        const start = () => this.scene.start("Story");

        playMusic(this);
        dialog.on(DialogBox.LINE_EVENT, ({ beat, sfx }: IntroLine) => {
            if (sfx) {
                playSfx(this, sfx);
            }
            if (beat) {
                office.play(beat);
            }
        });
        new Button(this, skip.x, skip.y, "Saltar", start, skip.width);
        this.input.keyboard!.on(PAUSE_KEY, () => openPauseMenu(this));
        bindAudioKeys(this);

        dialog.say(LINES, start);
    }
}
