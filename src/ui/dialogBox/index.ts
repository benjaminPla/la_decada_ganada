import { Button } from "../button";
import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME, textStyle, toCss } from "../../theme";

export type DialogChoice = {
    label:  string;
    onPick: () => void;
};

export type DialogLine = {
    speaker: Speaker;
    text:    string;
};

export type Speaker = {
    color: number;
    name:  string;
};

export class DialogBox extends Phaser.GameObjects.Container {
    static readonly HEIGHT = LAYOUT.height;

    private readonly choices:     Phaser.GameObjects.Container;
    private readonly hint:        Phaser.GameObjects.Text;
    private readonly lineText:    Phaser.GameObjects.Text;
    private readonly speakerName: Phaser.GameObjects.Text;

    private fullText:       string = "";
    private onDone:         (() => void) | null = null;
    private pendingChoices: readonly DialogChoice[] | null = null;
    private queue:          DialogLine[] = [];
    private typing:         Phaser.Time.TimerEvent | null = null;
    private waiting:        boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, scene.scale.height - LAYOUT.height);
        const { width } = scene.scale;
        const { padding } = LAYOUT;

        this.speakerName = scene.add.text(padding, padding, "", textStyle("ui", "md"));
        this.lineText = scene.add.text(padding, padding + THEME.spacing.lg + THEME.spacing.sm, "", {
            ...textStyle("ui", "md"),
            wordWrap: { width: width - padding * 2 },
        });
        this.hint = scene.add.text(width - padding, LAYOUT.height - padding, "▼", textStyle("ui", "md"))
            .setOrigin(1)
            .setVisible(false);
        this.choices = scene.add.container(width / 2, LAYOUT.height - padding - THEME.spacing.md);
        this.add([
            scene.add.rectangle(0, 0, width, LAYOUT.height, THEME.colors.surface).setOrigin(0),
            scene.add.rectangle(0, 0, width, LAYOUT.border, THEME.colors.paperBorder).setOrigin(0),
            this.speakerName,
            this.lineText,
            this.hint,
            this.choices,
        ]);
        scene.tweens.add({ alpha: 0, duration: LAYOUT.hintBlink, repeat: -1, targets: this.hint, yoyo: true });

        const keyboard = scene.input.keyboard!;
        scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.advance, this);
        keyboard.on("keydown-ENTER", this.advance, this);
        keyboard.on("keydown-SPACE", this.advance, this);
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.advance, this);
            keyboard.off("keydown-ENTER", this.advance, this);
            keyboard.off("keydown-SPACE", this.advance, this);
        });

        scene.add.existing(this);
    }

    ask(prompt: DialogLine, choices: readonly DialogChoice[]) {
        this.queue = [prompt];
        this.onDone = null;
        this.pendingChoices = choices;
        this.showNext();
    }

    say(lines: readonly DialogLine[], onDone: () => void) {
        this.queue = [...lines];
        this.onDone = onDone;
        this.pendingChoices = null;
        this.showNext();
    }

    // ---- flow

    private advance() {
        if (this.typing) {
            this.finishTyping();
            return;
        }
        if (!this.waiting) {
            return;
        }

        this.waiting = false;
        this.hint.setVisible(false);
        if (this.queue.length > 0) {
            this.showNext();
            return;
        }
        const onDone = this.onDone;
        this.onDone = null;
        onDone?.();
    }

    private finishTyping() {
        this.typing?.remove();
        this.typing = null;
        this.lineText.setText(this.fullText);

        if (this.queue.length === 0 && this.pendingChoices) {
            this.showChoices(this.pendingChoices);
            this.pendingChoices = null;
            return;
        }
        this.waiting = true;
        this.hint.setVisible(true);
    }

    private showNext() {
        const line = this.queue.shift()!;
        const color = toCss(line.speaker.color);

        this.choices.removeAll(true);
        this.fullText = line.text;
        this.speakerName.setText(line.speaker.name).setColor(color);
        this.lineText.setText("").setColor(color);

        let shown = 0;
        this.typing = this.scene.time.addEvent({
            callback: () => {
                this.lineText.setText(line.text.slice(0, ++shown));
                if (shown >= line.text.length) {
                    this.finishTyping();
                }
            },
            delay:  LAYOUT.typeDelay,
            repeat: line.text.length - 1,
        });
    }

    private showChoices(choices: readonly DialogChoice[]) {
        const { gap, width } = LAYOUT.choice;
        const total = choices.length * width + (choices.length - 1) * gap;

        choices.forEach(({ label, onPick }, i) => {
            const x = -total / 2 + width / 2 + i * (width + gap);
            this.choices.add(new Button(this.scene, x, 0, label, () => {
                this.choices.removeAll(true);
                onPick();
            }, width));
        });
    }
}
