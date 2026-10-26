import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME, textStyle } from "../../theme";
import type { Ending } from "../../progress/endings";
import { ENDING_EVENT, UNLOCK_EVENT } from "../../progress";
import type { Unlockable } from "../../progress/unlockables";
import { type SfxId, playSfx } from "../../audio";

type Toast = {
    name:  string;
    sfx:   SfxId;
    title: string;
};

// always-on overlay: any scene can trigger an unlock and the toast renders above it
export class Notifications extends Phaser.Scene {
    private queue:   Toast[] = [];
    private showing: boolean = false;

    constructor() {
        super("Notifications");
    }

    create() {
        const onEnding = ({ name }: Ending) => this.enqueue({ name, sfx: "ending", title: "FINAL DESBLOQUEADO" });
        // objects only appear when a run starts, so the toast says when to look
        const onUnlock = ({ name }: Unlockable) => this.enqueue({ name, sfx: "unlock", title: "OBJETO NUEVO · EN LA PRÓXIMA PARTIDA" });

        this.game.events.on(ENDING_EVENT, onEnding);
        this.game.events.on(UNLOCK_EVENT, onUnlock);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.game.events.off(ENDING_EVENT, onEnding);
            this.game.events.off(UNLOCK_EVENT, onUnlock);
        });
    }

    private enqueue(toast: Toast) {
        this.queue.push(toast);
        if (!this.showing) {
            this.showNext();
        }
    }

    private showNext() {
        const next = this.queue.shift();
        this.showing = next !== undefined;
        if (!next) {
            return;
        }

        playSfx(this, next.sfx);
        const { border, height, hold, margin, padding, slide, width } = LAYOUT;
        const x = this.scale.width - margin - width;
        const toast = this.add.container(x, -height, [
            this.add.rectangle(0, 0, width, height, THEME.colors.surface).setOrigin(0).setStrokeStyle(border, THEME.colors.accent),
            this.add.text(padding, padding, next.title, textStyle("ui", "sm", "accent")),
            this.add.text(padding, height - padding, next.name, textStyle("ui", "md")).setOrigin(0, 1),
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
