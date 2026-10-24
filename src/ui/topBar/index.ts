import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME } from "../../theme";
import { VOLUME_STEP, getSetting, setSetting } from "../../settings";
import { drawGear, drawSpeaker } from "../icons";

const SEGMENTS = Math.round(1 / VOLUME_STEP);

export class TopBar extends Phaser.GameObjects.Container {
    static readonly HEIGHT = LAYOUT.height;

    private readonly icons: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const { width } = scene.scale;

        this.icons = scene.add.graphics();
        this.add([
            scene.add.rectangle(0, 0, width, LAYOUT.height, THEME.colors.surface).setOrigin(0),
            scene.add.rectangle(0, LAYOUT.height, width, LAYOUT.border, THEME.colors.paperBorder).setOrigin(0),
            this.icons,
        ]);

        this.addButton(this.speakerX(), LAYOUT.icon, () => scene.registry.toggle("muted"));
        for (let i = 0; i < SEGMENTS; i++) {
            const level = i + 1;
            this.addButton(this.segmentX(i), LAYOUT.segment.width + LAYOUT.segment.gap, () => {
                setSetting(scene.registry, "muted", false);
                setSetting(scene.registry, "volume", level * VOLUME_STEP);
            });
        }
        this.addButton(this.gearX(), LAYOUT.icon, () => console.log("settings: open"));

        scene.add.existing(this);
        this.redraw();
        scene.registry.events.on(Phaser.Data.Events.CHANGE_DATA, this.redraw, this);
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            scene.registry.events.off(Phaser.Data.Events.CHANGE_DATA, this.redraw, this);
        });
    }

    private addButton(x: number, size: number, onClick: () => void) {
        const zone = this.scene.add.zone(x, LAYOUT.height / 2, size, LAYOUT.height)
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.POINTER_DOWN, onClick);
        this.add(zone);
    }

    private gearX() {
        return this.scene.scale.width - THEME.spacing.md - LAYOUT.icon / 2;
    }

    private redraw() {
        const muted = getSetting(this.scene.registry, "muted");
        const level = Math.round(getSetting(this.scene.registry, "volume") / VOLUME_STEP);
        const midY = LAYOUT.height / 2;
        const { segment } = LAYOUT;

        this.icons.clear();
        drawSpeaker(this.icons, this.speakerX(), midY, LAYOUT.icon, THEME.colors.text, muted);
        for (let i = 0; i < SEGMENTS; i++) {
            const h = segment.minHeight + ((segment.maxHeight - segment.minHeight) * i) / (SEGMENTS - 1);
            const on = !muted && i < level;
            this.icons.fillStyle(on ? THEME.colors.accent : THEME.colors.textMuted);
            this.icons.fillRect(this.segmentX(i) - segment.width / 2, midY + segment.maxHeight / 2 - h, segment.width, h);
        }
        drawGear(this.icons, this.gearX(), midY, LAYOUT.icon, THEME.colors.text, THEME.colors.surface);
    }

    private segmentX(i: number) {
        const start = THEME.spacing.md + LAYOUT.icon + THEME.spacing.md;
        return start + i * (LAYOUT.segment.width + LAYOUT.segment.gap);
    }

    private speakerX() {
        return THEME.spacing.md + LAYOUT.icon / 2;
    }
}
