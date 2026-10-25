import { Button } from "../../ui/button";
import { CONTROLS, PAUSE_KEY, bindAudioKeys } from "../../controls";
import { CREDITS, KOFI_URL } from "./credits";
import { ENDINGS } from "../../progress/endings";
import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME, textStyle } from "../../theme";
import { type MenuData, View } from "./types";
import { UNLOCKABLES } from "../../progress/unlockables";
import { VOLUME_STEP, changeVolume, getSetting } from "../../settings";
import { getProgress } from "../../progress";

export class Menu extends Phaser.Scene {
    private content!:    Phaser.GameObjects.Container;
    private currentView: View    = View.Main;
    private from:        string  = "";
    private paused:      boolean = false;

    private refreshSettings: (() => void) | null = null;

    constructor() {
        super("Menu");
    }

    init(data: MenuData) {
        this.paused      = data.paused ?? false;
        this.currentView = data.view ?? View.Main;
        this.from        = data.from ?? "";
    }

    create() {
        this.cameras.main.setBackgroundColor(THEME.colors.background);
        this.content = this.add.container(this.scale.width / 2, 0);

        if (this.paused) {
            this.scene.bringToTop();
            this.input.keyboard!.on(PAUSE_KEY, () => this.resume());
        }
        bindAudioKeys(this);

        const onSettingsChange = () => this.refreshSettings?.();
        this.registry.events.on(Phaser.Data.Events.CHANGE_DATA, onSettingsChange);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.registry.events.off(Phaser.Data.Events.CHANGE_DATA, onSettingsChange);
        });

        this.show(this.currentView);
    }

    private show(view: View) {
        this.currentView = view;
        this.refreshSettings = null;
        this.content.removeAll(true);

        switch (view) {
            case View.Collection:
                this.showCollection();
                break;
            case View.Controls:
                this.showControls();
                break;
            case View.Credits:
                this.showCredits();
                break;
            case View.Main:
                this.showMain();
                break;
            case View.Settings:
                this.showSettings();
                break;
        }
    }

    private showCollection() {
        const { buttons, collection } = LAYOUT;
        const { endings, unlocked } = getProgress();
        const top = this.scale.height * buttons.y;
        const found = UNLOCKABLES.filter(({ id }) => unlocked.includes(id)).length;

        this.addTitle("Colección");
        this.content.add(this.add.text(0, top, `Objetos ${found}/${UNLOCKABLES.length}`, textStyle("ui", "md", "accent")).setOrigin(0.5));
        UNLOCKABLES.forEach(({ description, id, name }, i) => {
            const y = top + (i + 1) * collection.rowHeight;
            const open = unlocked.includes(id);
            this.content.add([
                this.add.text(0, y, open ? name : "???", textStyle("ui", "md", open ? "text" : "textMuted")).setOrigin(0.5, 1),
                this.add.text(0, y, open ? description : "Seguí jugando", textStyle("ui", "sm", "textMuted")).setOrigin(0.5, 0),
            ]);
        });

        const endingsY = top + UNLOCKABLES.length * collection.rowHeight + collection.section;
        const reached = ENDINGS.filter(({ id }) => endings.includes(id)).length;
        const endingsLabel = ENDINGS.length > 0 ? `Finales ${reached}/${ENDINGS.length}` : "Finales: próximamente";
        this.content.add(this.add.text(0, endingsY, endingsLabel, textStyle("ui", "md", "accent")).setOrigin(0.5));
        this.addBack();
    }

    private showControls() {
        const { buttons, controls } = LAYOUT;
        const top = this.scale.height * buttons.y;

        this.addTitle("Controles");
        CONTROLS.forEach(({ action, key }, i) => {
            const y = top + i * controls.rowHeight;
            this.content.add([
                this.add.text(-controls.gap, y, key, textStyle("ui", "md", "accent")).setOrigin(1, 0.5),
                this.add.text(controls.gap, y, action, textStyle("ui", "md")).setOrigin(0, 0.5),
            ]);
        });
        this.addBack();
    }

    private showCredits() {
        const { height } = this.scale;
        const lines = CREDITS.map(({ name, role }) => `${role}: ${name}`).join("\n");

        this.addTitle("Créditos");
        this.content.add(this.add.text(0, height * LAYOUT.buttons.y, lines, {
            ...textStyle("ui", "sm"),
            align:       "center",
            lineSpacing: THEME.spacing.sm,
        }).setOrigin(0.5, 0));
        // noopener: the new tab gets no window.opener handle back into the game
        this.addButton(height * LAYOUT.back.y - LAYOUT.buttons.gap, "Invitame un café (Ko-fi)", () => {
            window.open(KOFI_URL, "_blank", "noopener,noreferrer");
        });
        this.addBack();
    }

    private showMain() {
        const { height } = this.scale;
        const { buttons, logo } = LAYOUT;
        const top = height * buttons.y;

        this.content.add(this.add.image(0, height * logo.y, "logo").setScale(logo.scale));
        this.addButton(top, this.paused ? "Continuar" : "Jugar", () => this.play());
        this.addButton(top + buttons.gap, "Ajustes", () => this.show(View.Settings));
        this.addButton(top + buttons.gap * 2, "Colección", () => this.show(View.Collection));
        this.addButton(top + buttons.gap * 3, "Controles", () => this.show(View.Controls));
        this.addButton(top + buttons.gap * 4, "Créditos", () => this.show(View.Credits));
        const share = this.addButton(top + buttons.gap * 5, "Compartir", () => this.share(share));
    }

    private showSettings() {
        const { registry } = this;
        const { buttons, volume } = LAYOUT;
        const top = this.scale.height * buttons.y;
        const soundLabel = () => `Sonido: ${getSetting(registry, "muted") ? "No" : "Sí"}`;
        const volumeLabel = () => `Volumen: ${Math.round(getSetting(registry, "volume") * 100)}%`;

        this.addTitle("Ajustes");
        const sound = this.addButton(top, soundLabel(), () => registry.toggle("muted"));

        const volumeY = top + buttons.gap;
        const volumeText = this.add.text(0, volumeY, volumeLabel(), textStyle("ui", "md")).setOrigin(0.5);
        this.content.add([
            volumeText,
            new Button(this, -volume.offset, volumeY, "-", () => changeVolume(registry, -VOLUME_STEP), volume.size),
            new Button(this, volume.offset, volumeY, "+", () => changeVolume(registry, VOLUME_STEP), volume.size),
        ]);
        this.addBack();

        // keys (M, arrows) change settings too, so labels follow the registry rather than the buttons
        this.refreshSettings = () => {
            sound.setLabel(soundLabel());
            volumeText.setText(volumeLabel());
        };
    }

    private play() {
        if (this.paused) {
            this.resume();
            return;
        }
        this.scene.start("Intro");
    }

    private resume() {
        this.scene.resume(this.from);
        this.scene.stop();
    }

    private async share(button: Button) {
        const url = `${location.origin}${location.pathname}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: document.title, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            this.flash(button, "¡Enlace copiado!", "Compartir");
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }
            this.flash(button, "No se pudo copiar", "Compartir");
        }
    }

    private addBack() {
        this.addButton(this.scale.height * LAYOUT.back.y, "Volver", () => this.show(View.Main));
    }

    private addButton(y: number, text: string, onClick: () => void) {
        const button = new Button(this, 0, y, text, onClick);
        this.content.add(button);
        return button;
    }

    private addTitle(text: string) {
        this.content.add(this.add.text(0, this.scale.height * LAYOUT.title.y, text, textStyle("ui", "xl")).setOrigin(0.5));
    }

    private flash(button: Button, text: string, restore: string) {
        button.setLabel(text);
        this.time.delayedCall(LAYOUT.feedbackDuration, () => button.active && button.setLabel(restore));
    }
}
