import { CHANNELS } from "./channels";
import { DialogBox } from "../../ui/dialogBox";
import { LAYOUT } from "./layout";
import { type NodeId, START, STORY } from "./script";
import { PAUSE_KEY, bindAudioKeys } from "../../controls";
import { PLAYER } from "./art/player";
import Phaser from "phaser";
import { createPixelTexture } from "../../ui/pixelArt";
import { drawRoom, drawTv } from "./room";
import { openPauseMenu } from "../menu/pause";
import { playMusic } from "../../audio";
import { track } from "../../progress";

export class Intro extends Phaser.Scene {
    private dialog!: DialogBox;
    private tv!:     ReturnType<typeof drawTv>;

    constructor() {
        super("Intro");
    }

    create() {
        const { player } = LAYOUT;

        track(this.game, { type: "run-started" });
        playMusic(this);
        drawRoom(this);
        this.tv = drawTv(this, CHANNELS.tn);

        createPixelTexture(this, "player", PLAYER, player.scale);
        const sprite = this.add.image(player.x, player.y, "player").setOrigin(0.5, 1);
        this.tweens.add({ duration: 70, repeat: -1, targets: sprite, x: player.x + player.shake, yoyo: true });

        this.dialog = new DialogBox(this);
        this.input.keyboard!.on(PAUSE_KEY, () => openPauseMenu(this));
        bindAudioKeys(this);

        this.run(START);
    }

    // walks the story graph: lines, then choices, a next node, or the end of the run
    private run(id: NodeId) {
        const node = STORY[id];
        if (node.channel) {
            this.tv.setChannel(CHANNELS[node.channel]);
        }

        this.dialog.say(node.lines, () => {
            if (node.choices) {
                this.dialog.ask(node.choices.prompt, node.choices.options.map(({ id, label, next }) => ({
                    label,
                    onPick: () => {
                        track(this.game, { choice: id, type: "choice-made" });
                        this.run(next);
                    },
                })));
                return;
            }
            if (node.next) {
                this.run(node.next);
                return;
            }
            if (node.ending) {
                track(this.game, { ending: node.ending, type: "ending-reached" });
            }
            this.scene.start("Menu");
        });
    }
}
