import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME, textStyle } from "../../theme";
import { TopBar } from "../../ui/topBar";
import { VOLUME_STEP, getSetting, setSetting } from "../../settings";

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

        new TopBar(this);

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
        keyboard.on("keydown-DOWN", () => this.changeVolume(-VOLUME_STEP));
        keyboard.on("keydown-M", () => this.registry.toggle("muted"));
        keyboard.on("keydown-UP", () => this.changeVolume(VOLUME_STEP));
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.stamp();
        }
    }

    private changeVolume(step: number) {
        const volume = Phaser.Math.Clamp(getSetting(this.registry, "volume") + step, 0, 1);
        setSetting(this.registry, "volume", Math.round(volume / VOLUME_STEP) * VOLUME_STEP);
        if (step > 0) {
            setSetting(this.registry, "muted", false);
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
