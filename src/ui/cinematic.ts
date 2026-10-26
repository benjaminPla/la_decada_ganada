import Phaser from "phaser";

// every figure in a cinematic is drawn in these; only backgrounds get color
export const SILHOUETTE = {
    dark: 0x0b0b0b,
    grey: 0x1e1e1e,
} as const;

const FRAME = 140;

// low frame rate on purpose: n steps, one every FRAME ms
export function steps(scene: Phaser.Scene, count: number, onStep: (i: number) => void, onDone?: () => void) {
    if (count <= 0) {
        onDone?.();
        return;
    }
    let i = 0;
    scene.time.addEvent({
        callback: () => {
            onStep(i);
            if (++i === count) {
                onDone?.();
            }
        },
        delay:  FRAME,
        repeat: count - 1,
    });
}
