import { Boot } from "./scenes/boot";
import { Desk } from "./scenes/desk";
import Phaser from "phaser";
import { Preloader } from "./scenes/preloader";
import { THEME } from "./theme";

new Phaser.Game({
    backgroundColor: THEME.colors.background,
    height: 720,
    scale: { autoCenter: Phaser.Scale.CENTER_BOTH, mode: Phaser.Scale.FIT },
    scene: [Boot, Preloader, Desk],
    type: Phaser.AUTO,
    width: 1280,
});
