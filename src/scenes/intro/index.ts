import { CHOICES, ENDING, OPENING, PROMPT } from "./script";
import { DialogBox } from "../../ui/dialogBox";
import { LAYOUT } from "./layout";
import { PAUSE_KEY, bindAudioKeys } from "../../controls";
import { PLAYER } from "./art/player";
import Phaser from "phaser";
import { createPixelTexture } from "../../ui/pixelArt";
import { drawRoom, drawTv } from "./room";
import { openPauseMenu } from "../menu/pause";
import { playMusic } from "../../audio";
import { track } from "../../progress";

export class Intro extends Phaser.Scene {
    constructor() {
        super("Intro");
    }

    create() {
        const { player } = LAYOUT;

        track(this.game, { type: "run-started" });
        playMusic(this);
        drawRoom(this);
        drawTv(this);

        createPixelTexture(this, "player", PLAYER, player.scale);
        const sprite = this.add.image(player.x, player.y, "player").setOrigin(0.5, 1);
        this.tweens.add({ duration: 70, repeat: -1, targets: sprite, x: player.x + player.shake, yoyo: true });

        const dialog = new DialogBox(this);
        dialog.say(OPENING, () => dialog.ask(PROMPT, CHOICES.map(({ id, label, reaction }) => ({
            label,
            onPick: () => {
                track(this.game, { choice: id, type: "choice-made" });
                dialog.say(reaction, () => dialog.say(ENDING, () => this.scene.start("Menu")));
            },
        }))));

        this.input.keyboard!.on(PAUSE_KEY, () => openPauseMenu(this));
        bindAudioKeys(this);
    }
}
