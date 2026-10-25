import { CHANNELS } from "./channels";
import { DialogBox } from "../../ui/dialogBox";
import { Expression } from "./types";
import { LAYOUT } from "./layout";
import { type NodeId, START, STORY, type StoryLine } from "./script";
import { PAUSE_KEY, bindAudioKeys } from "../../controls";
import { PLAYER_FACES } from "./art/player";
import Phaser from "phaser";
import { createPixelTexture } from "../../ui/pixelArt";
import { drawRoom, drawTv } from "./room";
import { openPauseMenu } from "../menu/pause";
import { playMusic } from "../../audio";
import { track } from "../../progress";

export class Intro extends Phaser.Scene {
    private dialog!: DialogBox;
    private player!: Phaser.GameObjects.Image;
    private shake!:  Phaser.Tweens.Tween;
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

        Object.values(Expression).forEach((e) => createPixelTexture(this, `player-${e}`, PLAYER_FACES[e], player.scale));
        this.player = this.add.image(player.x, player.y, `player-${Expression.Angry}`).setOrigin(0.5, 1);
        this.shake = this.tweens.add({ duration: 70, repeat: -1, targets: this.player, x: player.x + player.shake, yoyo: true });
        this.setExpression(Expression.Angry);

        this.dialog = new DialogBox(this);
        this.dialog.on(DialogBox.LINE_EVENT, ({ expression }: StoryLine) => expression && this.setExpression(expression));
        this.input.keyboard!.on(PAUSE_KEY, () => openPauseMenu(this));
        bindAudioKeys(this);

        this.run(START);
    }

    // rage shakes; calmer faces stand still
    private setExpression(expression: Expression) {
        const angry = expression === Expression.Angry || expression === Expression.Furious;
        this.player.setTexture(`player-${expression}`);
        if (angry) {
            this.shake.resume();
            return;
        }
        this.shake.pause();
        this.player.x = LAYOUT.player.x;
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
