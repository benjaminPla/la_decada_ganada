import { CHANNELS } from "./channels";
import { type Death, type DeathId, drawDeath, isDeath } from "./deaths";
import { DialogBox } from "../../ui/dialogBox";
import { EMPTY_STATS, type Stat, type Stats } from "../../stats";
import { Expression } from "./types";
import { LAYOUT } from "./layout";
import { type NodeId, START, STORY, type StoryLine } from "./script";
import { PAUSE_KEY, bindAudioKeys } from "../../controls";
import { PLAYER_FACES } from "./art/player";
import Phaser from "phaser";
import { type PlaceId, drawPlace } from "./places";
import { createPixelTexture } from "../../ui/pixelArt";
import { drawRoom, drawTv } from "./room";
import { mountObjects } from "./objects";
import { openPauseMenu } from "../menu/pause";
import { playMusic, playSfx } from "../../audio";
import { track } from "../../progress";

export class Intro extends Phaser.Scene {
    private death:   Death | null = null;
    private dialog!: DialogBox;
    private place!:  PlaceId;
    private places!: Partial<Record<PlaceId, Phaser.GameObjects.Container>>;
    private player!: Phaser.GameObjects.Image;
    private shake!:  Phaser.Tweens.Tween;
    private stats!:  Stats;
    private tv!:     ReturnType<typeof drawTv>;

    constructor() {
        super("Intro");
    }

    create() {
        const { player } = LAYOUT;

        this.stats = { ...EMPTY_STATS };
        track(this.game, { type: "run-started" });
        playMusic(this);
        this.tv = drawTv(this, CHANNELS.tn);
        this.death = null;
        this.place = "room";
        this.places = { room: this.mountPlace("room", [drawRoom(this), this.tv.container]) };

        Object.values(Expression).forEach((e) => createPixelTexture(this, `player-${e}`, PLAYER_FACES[e], player.scale));
        this.player = this.add.image(player.x, player.y, `player-${Expression.Angry}`).setOrigin(0.5, 1);
        this.shake = this.tweens.add({ duration: 70, repeat: -1, targets: this.player, x: player.x + player.shake, yoyo: true });
        this.setExpression(Expression.Angry);

        this.dialog = new DialogBox(this);
        this.dialog.on(DialogBox.LINE_EVENT, ({ beat, expression, place, sfx }: StoryLine) => {
            if (expression) {
                this.setExpression(expression);
            }
            if (place) {
                this.setPlace(place);
            }
            if (sfx) {
                playSfx(this, sfx);
            }
            if (beat) {
                this.death?.play(beat);
            }
        });
        this.input.keyboard!.on(PAUSE_KEY, () => openPauseMenu(this));
        bindAudioKeys(this);

        this.run(START);
    }

    private apply(effects: Partial<Stats> = {}) {
        (Object.entries(effects) as [Stat, number][]).forEach(([stat, delta]) => { this.stats[stat] += delta });
    }

    // places sit behind the player and dialog, with their objects on top of the background
    private mountPlace(id: PlaceId, background: Phaser.GameObjects.GameObject[]) {
        const container = this.add.container(0, 0, background).setDepth(-1);
        mountObjects(this, id, container);
        return container;
    }

    // the room is built up front; other places on first visit
    private setPlace(id: PlaceId) {
        if (id === this.place) {
            return;
        }
        this.places[this.place]!.setVisible(false);
        this.places[id] ??= this.buildPlace(id);
        this.places[id].setVisible(true);
        this.player.setVisible(!isDeath(id));
        this.place = id;
    }

    // deaths are self-contained cinematics: the player is drawn inside them, so the portrait hides
    private buildPlace(id: PlaceId) {
        if (isDeath(id)) {
            this.death = drawDeath(this, id);
            if (id === "death-home") {
                mountObjects(this, "bathroom", this.death.decor);
            }
            return this.death.container.setDepth(-1);
        }
        return this.mountPlace(id, [drawPlace(this, id as Exclude<PlaceId, DeathId | "room">)]);
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

    // walks the story graph: lines, then choices, the first matching route, a next node, or the end of the run
    private run(id: NodeId) {
        const node = STORY[id];
        if (node.channel) {
            this.tv.setChannel(CHANNELS[node.channel]);
        }

        this.dialog.say(node.lines, () => {
            if (node.choices) {
                const options = node.choices.options.filter(({ when }) => !when || when(this.stats));
                this.dialog.ask(node.choices.prompt, options.map(({ effects, id, label, next }) => ({
                    label,
                    onPick: () => {
                        this.apply(effects);
                        track(this.game, { choice: id, stats: this.stats, type: "choice-made" });
                        this.run(next);
                    },
                })));
                return;
            }
            const next = node.route?.find(({ when }) => !when || when(this.stats))?.next ?? node.next;
            if (next) {
                this.run(next);
                return;
            }
            if (node.ending) {
                track(this.game, { ending: node.ending, type: "ending-reached" });
            }
            this.scene.start("Menu");
        });
    }
}
