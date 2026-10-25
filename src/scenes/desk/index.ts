import { LAYOUT } from "./layout";
import type { MenuData } from "../menu/types";
import Phaser from "phaser";
import { THEME, textStyle } from "../../theme";
import { TopBar } from "../../ui/topBar";
import { VOLUME_STEP, changeVolume } from "../../settings";

const MUSIC_MIX = 0.5;

export class Desk extends Phaser.Scene {
    private paper!: Phaser.Geom.Rectangle;
    private space!: Phaser.Input.Keyboard.Key;

    constructor() {
        super("Desk");
    }

    create() {
        const { height, width } = this.scale;
        const { paper } = LAYOUT;
        const centerY = (height + TopBar.HEIGHT) / 2;

        new TopBar(this, () => this.pause({ view: "settings" }));

        this.paper = new Phaser.Geom.Rectangle((width - paper.width) / 2, centerY - paper.height / 2, paper.width, paper.height);
        this.add.rectangle(this.paper.centerX, this.paper.centerY, paper.width, paper.height, THEME.colors.paper)
            .setStrokeStyle(paper.border, THEME.colors.paperBorder);
        this.add.text(
            this.paper.centerX,
            this.paper.y + LAYOUT.titleOffset,
            "DECRETO DE NECESIDAD Y URGENCIA",
            textStyle("document", "md", "textDark"),
        ).setOrigin(0.5, 0);

        const music = this.sound.get("music") ?? this.sound.add("music", { loop: true, volume: MUSIC_MIX });
        if (!music.isPlaying) {
            music.play();
        }

        const keyboard = this.input.keyboard!;
        this.space = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyboard.on("keydown-DOWN", () => changeVolume(this.registry, -VOLUME_STEP));
        keyboard.on("keydown-ESC", () => this.pause());
        keyboard.on("keydown-M", () => this.registry.toggle("muted"));
        keyboard.on("keydown-UP", () => changeVolume(this.registry, VOLUME_STEP));
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.stamp();
        }
    }

    private pause(data: MenuData = {}) {
        this.scene.launch("Menu", { ...data, paused: true });
        this.scene.pause();
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
