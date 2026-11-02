import { DialogBox } from "../../ui/dialogBox";
import Phaser from "phaser";
import { steps } from "../../ui/cinematic";
import { textStyle } from "../../theme";

// drawn over every opening: the title card that open lifts, the black that fade brings down
export function drawFrame(scene: Phaser.Scene) {
    const { width } = scene.scale;
    const height = scene.scale.height - DialogBox.HEIGHT;

    const title = scene.add.container(0, 0, [
        scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0),
        scene.add.text(width / 2, height / 2, "AÑO 3 DEL MILEONATO", textStyle("ui", "xl")).setOrigin(0.5),
    ]);
    const blackout = scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0).setAlpha(0);

    return {
        fade: () => steps(scene, 4, (i) => blackout.setAlpha((i + 1) / 4)),
        open: () => steps(scene, 4, (i) => title.setAlpha(1 - (i + 1) / 4), () => title.destroy()),
    };
}
