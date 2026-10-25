import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME, textStyle, toCss } from "../../theme";

export class Button extends Phaser.GameObjects.Container {
    private readonly background: Phaser.GameObjects.Rectangle;
    private readonly label:      Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void, width: number = LAYOUT.width) {
        super(scene, x, y);

        this.background = scene.add.rectangle(0, 0, width, LAYOUT.height, THEME.colors.surface);
        this.label      = scene.add.text(0, 0, text, textStyle("ui", "md")).setOrigin(0.5);
        this.add([this.background, this.label]);
        this.setHover(false);

        this.setSize(width, LAYOUT.height)
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.POINTER_OUT,  () => this.setHover(false))
            .on(Phaser.Input.Events.POINTER_OVER, () => this.setHover(true))
            .on(Phaser.Input.Events.POINTER_UP, onClick);

        scene.add.existing(this);
    }

    setLabel(text: string) {
        this.label.setText(text);
        return this;
    }

    private setHover(hover: boolean) {
        this.background.setStrokeStyle(LAYOUT.border, hover ? THEME.colors.accent : THEME.colors.paperBorder);
        this.label.setColor(toCss(hover ? THEME.colors.accent : THEME.colors.text));
    }
}
