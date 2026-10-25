import Phaser from "phaser";
import { VOLUME_STEP, changeVolume } from "./settings";

export const CONTROLS = [
    { action: "Pausar",                  key: "P" },
    { action: "Silenciar",               key: "M" },
    { action: "Subir / bajar volumen",   key: "↑ / ↓" },
    { action: "Mostrar el texto rápido", key: "Clic" },
] as const;

export const PAUSE_KEY = "keydown-P";

export function bindAudioKeys(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;
    keyboard.on("keydown-DOWN", () => changeVolume(scene.registry, -VOLUME_STEP));
    keyboard.on("keydown-M", () => scene.registry.toggle("muted"));
    keyboard.on("keydown-UP", () => changeVolume(scene.registry, VOLUME_STEP));
}
