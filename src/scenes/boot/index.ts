import Phaser from "phaser";
import { initSettings } from "../../settings";

export class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.on("loaderror", (file: Phaser.Loader.File) => console.warn(`Failed to load "${file.key}" from ${file.url}`));

        this.load.font("pixelify", "assets/fonts/pixelify-sans/PixelifySans.ttf");
        this.load.image("logo", "assets/ui/logo.png");
    }

    create() {
        initSettings(this.game);
        this.scene.launch("Notifications");
        this.scene.start("Preloader");
    }
}
