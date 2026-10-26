import { Boot } from "./scenes/boot";
import { Intro } from "./scenes/intro";
import { Menu } from "./scenes/menu";
import { Notifications } from "./scenes/notifications";
import Phaser from "phaser";
import { Preloader } from "./scenes/preloader";
import { Story } from "./scenes/story";
import { THEME } from "./theme";

new Phaser.Game({
    backgroundColor: THEME.colors.background,
    height: 720,
    scale: { autoCenter: Phaser.Scale.CENTER_BOTH, mode: Phaser.Scale.FIT },
    scene: [Boot, Preloader, Menu, Intro, Story, Notifications],
    type: Phaser.AUTO,
    width: 1280,
});
