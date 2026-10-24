import { LAYOUT } from "./layout";
import { LOADING_MESSAGES } from "./loadingMessages";
import Phaser from "phaser";
import { THEME, textStyle } from "../../theme";

export class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        const { height, width } = this.scale;
        const { bar, logo } = LAYOUT;
        const centerX = width / 2;

        const logoImage = this.add.image(centerX, height * logo.y, "logo").setAlpha(0).setScale(logo.introScale);
        this.tweens.add({ alpha: 1, duration: logo.introDuration, ease: "Back.easeOut", scale: logo.scale, targets: logoImage });

        const barY = height * bar.y;
        const message = Phaser.Utils.Array.GetRandom([...LOADING_MESSAGES]);
        this.add.text(centerX, barY - LAYOUT.messageOffset, message, textStyle("ui", "lg")).setOrigin(0.5);
        this.add.rectangle(centerX, barY, bar.width + bar.padding * 2, bar.height + bar.padding * 2)
            .setStrokeStyle(bar.border, THEME.colors.text);
        const fill = this.add.rectangle(centerX - bar.width / 2, barY, 0, bar.height, THEME.colors.accent).setOrigin(0, 0.5);

        this.load.on("progress", (value: number) => { fill.width = bar.width * value });

        this.load.audio("music", "assets/music/melody.wav");
        this.load.audio("stamp", "assets/sfx/stamp.wav");
    }

    create() {
        this.scene.start("Desk");
    }
}
