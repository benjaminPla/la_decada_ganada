import Phaser from "phaser";
import { initSettings } from "../../settings";

export class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.font("pixelify", "assets/fonts/pixelify-sans/PixelifySans.ttf");
        this.load.font("special-elite", "assets/fonts/special-elite/SpecialElite.ttf");
        this.load.image("logo", "assets/ui/logo.png");
    }

    create() {
        initSettings(this.game);
        this.scene.start("Preloader");
    }
}
