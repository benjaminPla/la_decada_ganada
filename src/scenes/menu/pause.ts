import type { MenuData } from "./types";
import Phaser from "phaser";

export function openPauseMenu(scene: Phaser.Scene, data: MenuData = {}) {
    scene.scene.launch("Menu", { ...data, from: scene.scene.key, paused: true } satisfies MenuData);
    scene.scene.pause();
}
