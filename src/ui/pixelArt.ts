import Phaser from "phaser";
import { toCss } from "../theme";

export type PixelArt = {
    palette: Record<string, number>;
    rows:    readonly string[];
};

// painted at final size so the texture stays crisp without a global pixelArt filter
export function createPixelTexture(scene: Phaser.Scene, key: string, art: PixelArt, scale: number) {
    if (scene.textures.exists(key)) {
        return;
    }

    const width = art.rows[0].length;
    const texture = scene.textures.createCanvas(key, width * scale, art.rows.length * scale)!;
    const { context } = texture;

    art.rows.forEach((row, y) => {
        for (let x = 0; x < width; x++) {
            const color = art.palette[row[x]];
            if (color === undefined) {
                continue;
            }
            context.fillStyle = toCss(color);
            context.fillRect(x * scale, y * scale, scale, scale);
        }
    });
    texture.refresh();
}
