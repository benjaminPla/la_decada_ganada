import Phaser from "phaser";

const MUSIC_MIX = 0.5;

export const SFX = ["burst", "click", "coins", "crash", "crowd", "gunshot", "knock", "notify", "static", "unlock", "waves"] as const;

export type SfxId = typeof SFX[number];

// keys match the file names under assets/sfx
export function loadSfx(load: Phaser.Loader.LoaderPlugin) {
    SFX.forEach((id) => load.audio(id, `assets/sfx/${id}.wav`));
}

export function playMusic(scene: Phaser.Scene) {
    const music = scene.sound.get("music") ?? scene.sound.add("music", { loop: true, volume: MUSIC_MIX });
    if (!music.isPlaying) {
        music.play();
    }
}

export function playSfx(scene: Phaser.Scene, id: SfxId) {
    scene.sound.play(id);
}
