import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME, textStyle } from "../../theme";
import { UNLOCK_EVENT } from "../../progress";
import type { Unlockable } from "../../progress/unlockables";

// always-on overlay: any scene can trigger an unlock and the toast renders above it
export class Notifications extends Phaser.Scene {
    private queue:   Unlockable[] = [];
    private showing: boolean = false;

    constructor() {
        super("Notifications");
    }

    create() {
        this.game.events.on(UNLOCK_EVENT, this.enqueue, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.game.events.off(UNLOCK_EVENT, this.enqueue, this));
    }

    private enqueue(unlockable: Unlockable) {
        this.queue.push(unlockable);
        if (!this.showing) {
            this.showNext();
        }
    }

    private showNext() {
        const unlockable = this.queue.shift();
        this.showing = unlockable !== undefined;
        if (!unlockable) {
            return;
        }

        const { border, height, hold, margin, padding, slide, width } = LAYOUT;
        const x = this.scale.width - margin - width;
        const toast = this.add.container(x, -height, [
            this.add.rectangle(0, 0, width, height, THEME.colors.surface).setOrigin(0).setStrokeStyle(border, THEME.colors.accent),
            this.add.text(padding, padding, "OBJETO DESBLOQUEADO", textStyle("ui", "sm", "accent")),
            this.add.text(padding, height - padding, unlockable.name, textStyle("ui", "md")).setOrigin(0, 1),
        ]);

        this.tweens.chain({
            onComplete: () => {
                toast.destroy();
                this.showNext();
            },
            targets: toast,
            tweens:  [
                { duration: slide, ease: "Back.easeOut", y: margin },
                { delay: hold, duration: slide, ease: "Quad.easeIn", y: -height },
            ],
        });
    }
}
