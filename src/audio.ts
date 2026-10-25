import Phaser from "phaser";

const MUSIC_MIX = 0.5;

export function playMusic(scene: Phaser.Scene) {
    const music = scene.sound.get("music") ?? scene.sound.add("music", { loop: true, volume: MUSIC_MIX });
    if (!music.isPlaying) {
        music.play();
    }
}
