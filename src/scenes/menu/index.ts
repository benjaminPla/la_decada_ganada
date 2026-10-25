import { Button } from "../../ui/button";
import { CREDITS } from "./credits";
import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME, textStyle } from "../../theme";
import { type MenuData, View } from "./types";
import { VOLUME_STEP, changeVolume, getSetting } from "../../settings";

export class Menu extends Phaser.Scene {
    private content!:    Phaser.GameObjects.Container;
    private currentView: View    = View.Main;
    private paused:      boolean = false;

    constructor() {
        super("Menu");
    }

    init(data: MenuData) {
        this.paused      = data.paused ?? false;
        this.currentView = data.view ?? View.Main;
    }

    create() {
        this.cameras.main.setBackgroundColor(THEME.colors.background);
        this.content = this.add.container(this.scale.width / 2, 0);

        if (this.paused) {
            this.scene.bringToTop();
            this.input.keyboard!.on("keydown-ESC", () => this.resume());
        }
        this.show(this.currentView);
    }

    private show(view: View) {
        this.currentView = view;
        this.content.removeAll(true);

        switch (view) {
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

    private showCredits() {
        const { height } = this.scale;
        const lines = CREDITS.map(({ name, role }) => `${role}: ${name}`).join("\n");

        this.addTitle("Créditos");
        this.content.add(this.add.text(0, height * LAYOUT.buttons.y, lines, {
            ...textStyle("ui", "sm"),
            align:       "center",
            lineSpacing: THEME.spacing.sm,
        }).setOrigin(0.5, 0));
        this.addBack();
    }

    private showMain() {
        const { height } = this.scale;
        const { buttons, logo } = LAYOUT;
        const top = height * buttons.y;

        this.content.add(this.add.image(0, height * logo.y, "logo").setScale(logo.scale));
        this.addButton(top, this.paused ? "Continuar" : "Jugar", () => this.play());
        this.addButton(top + buttons.gap, "Ajustes", () => this.show(View.Settings));
        this.addButton(top + buttons.gap * 2, "Créditos", () => this.show(View.Credits));
        const share = this.addButton(top + buttons.gap * 3, "Compartir", () => this.share(share));
    }

    private showSettings() {
        const { registry } = this;
        const { buttons, volume } = LAYOUT;
        const top = this.scale.height * buttons.y;
        const soundLabel = () => `Sonido: ${getSetting(registry, "muted") ? "No" : "Sí"}`;
        const volumeLabel = () => `Volumen: ${Math.round(getSetting(registry, "volume") * 100)}%`;

        this.addTitle("Ajustes");
        const sound = this.addButton(top, soundLabel(), () => {
            registry.toggle("muted");
            sound.setLabel(soundLabel());
        });

        const volumeY = top + buttons.gap;
        const volumeText = this.add.text(0, volumeY, volumeLabel(), textStyle("ui", "md")).setOrigin(0.5);
        const step = (delta: number) => {
            changeVolume(registry, delta);
            sound.setLabel(soundLabel());
            volumeText.setText(volumeLabel());
        };
        this.content.add([
            volumeText,
            new Button(this, -volume.offset, volumeY, "-", () => step(-VOLUME_STEP), volume.size),
            new Button(this, volume.offset, volumeY, "+", () => step(VOLUME_STEP), volume.size),
        ]);
        this.addBack();
    }

    private play() {
        if (this.paused) {
            this.resume();
            return;
        }
        this.scene.start("Desk");
    }

    private resume() {
        this.scene.resume("Desk");
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
