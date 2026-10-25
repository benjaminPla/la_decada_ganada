import { LAYOUT } from "./layout";
import { PAUSE_KEY, bindAudioKeys } from "../../controls";
import Phaser from "phaser";
import { THEME, textStyle } from "../../theme";
import { openPauseMenu } from "../menu/pause";
import { playMusic } from "../../audio";

export class Desk extends Phaser.Scene {
    private paper!: Phaser.Geom.Rectangle;
    private space!: Phaser.Input.Keyboard.Key;

    constructor() {
        super("Desk");
    }

    create() {
        const { height, width } = this.scale;
        const { paper } = LAYOUT;
        const centerY = height / 2;

        this.paper = new Phaser.Geom.Rectangle((width - paper.width) / 2, centerY - paper.height / 2, paper.width, paper.height);
        this.add.rectangle(this.paper.centerX, this.paper.centerY, paper.width, paper.height, THEME.colors.paper)
            .setStrokeStyle(paper.border, THEME.colors.paperBorder);
        this.add.text(
            this.paper.centerX,
            this.paper.y + LAYOUT.titleOffset,
            "DECRETO DE NECESIDAD Y URGENCIA",
            textStyle("document", "md", "textDark"),
        ).setOrigin(0.5, 0);

        playMusic(this);

        const keyboard = this.input.keyboard!;
        this.space = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyboard.on(PAUSE_KEY, () => openPauseMenu(this));
        bindAudioKeys(this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.stamp();
        }
    }

    private stamp() {
        const { stamp } = LAYOUT;
        const x = Phaser.Math.Between(this.paper.left + stamp.margin, this.paper.right - stamp.margin);
        const y = Phaser.Math.Between(this.paper.top + stamp.margin * 1.5, this.paper.bottom - stamp.margin);
        this.add.circle(x, y, stamp.radius).setStrokeStyle(stamp.border, THEME.colors.ink);
        this.add.text(x, y, "APROBADO", textStyle("document", "sm", "ink")).setOrigin(0.5);
        this.sound.play("stamp");
    }
}
