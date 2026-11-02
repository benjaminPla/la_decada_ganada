import { DialogBox } from "../../ui/dialogBox";
import type { IntroBeat, Opening } from "./types";
import Phaser from "phaser";
import { SILHOUETTE, steps } from "../../ui/cinematic";

type Arms = "down" | "toast" | "up";

const COLORS = {
    brick:   0x8a5a42,
    ember:   0xff7a2a,
    grill:   0x7a3a24,
    hood:    0x6a3220,
    meat:    0x5a1a10,
    mortar:  0x6a4232,
    patio:   0x5a4a3a,
    sky:     [0x6a4a7a, 0xd8805a, 0xf0b070],
    smoke:   0x9a9a9a,
    tile:    0x4a3c30,
} as const;

const FAMILY = 5;

// sunday barbecue in the backyard: the uncle and his chainsaw at the grill, the family at the table
export function drawAsado(scene: Phaser.Scene): Opening {
    const { width } = scene.scale;
    const height = scene.scale.height - DialogBox.HEIGHT;
    const floor = height - 50;
    const tableTop = floor - 118;

    const g = scene.add.graphics();
    drawYard(g, width, height, floor);
    drawGrill(g, floor);
    drawTable(g, floor, tableTop);
    drawPlayer(g, floor, tableTop);

    const family = scene.add.graphics();
    const pose = (arms: Arms, phase = 0) => drawFamily(family, tableTop, arms, phase);
    pose("down");

    const uncle = scene.add.container(0, 0, [drawUncle(scene, floor)]);
    const dog = scene.add.container(0, 0, [drawDog(scene, floor)]);

    const play = (beat: IntroBeat) => {
        switch (beat) {
            case "bark":
                steps(scene, 6, (i) => { dog.y = [-16, -24, -16, 0, -12, 0][i] });
                break;
            case "chant":
                steps(scene, 10, (i) => pose("up", i), () => pose("down"));
                break;
            case "saw":
                steps(scene, 10, (i) => { uncle.x = i % 2 ? 4 : -4 }, () => { uncle.x = 0 });
                break;
            case "toast":
                pose("toast");
                break;
        }
    };

    return { play };
}

// ---- background: the only thing with color

function drawYard(g: Phaser.GameObjects.Graphics, width: number, height: number, floor: number) {
    COLORS.sky.forEach((color, i) => g.fillStyle(color).fillRect(0, i * 70, width, 70));
    g.fillStyle(COLORS.brick).fillRect(0, 200, width, floor - 200);
    g.fillStyle(COLORS.mortar);
    for (let y = 200, row = 0; y < floor; y += 24, row++) {
        g.fillRect(0, y, width, 3);
        for (let x = row % 2 ? 24 : 0; x < width; x += 48) {
            g.fillRect(x, y, 3, 24);
        }
    }
    g.fillStyle(COLORS.patio).fillRect(0, floor, width, height - floor);
    g.fillStyle(COLORS.tile);
    for (let x = 0; x < width; x += 64) {
        g.fillRect(x, floor, 2, height - floor);
    }
}

function drawGrill(g: Phaser.GameObjects.Graphics, floor: number) {
    const v = (x: number, y: number) => new Phaser.Math.Vector2(x, y);
    g.fillStyle(COLORS.hood).fillPoints([v(980, floor - 250), v(1240, floor - 250), v(1150, floor - 330), v(1070, floor - 330)], true);
    g.fillRect(1080, 0, 60, floor - 328);
    g.fillStyle(COLORS.grill).fillRect(980, floor - 170, 260, 170).fillRect(980, floor - 250, 20, 80).fillRect(1220, floor - 250, 20, 80);
    g.fillStyle(COLORS.ember).fillRect(1000, floor - 184, 220, 14);
    g.fillStyle(COLORS.ember, 0.12).fillCircle(1110, floor - 190, 140);
    g.fillStyle(COLORS.meat).fillRect(1012, floor - 196, 70, 12).fillRect(1100, floor - 194, 50, 10).fillRect(1160, floor - 196, 46, 12);
    g.fillStyle(COLORS.smoke, 0.25).fillCircle(1100, 40, 26).fillCircle(1130, 14, 20).fillCircle(1086, 70, 18);
}

// ---- figures: silhouettes

function drawTable(g: Phaser.GameObjects.Graphics, floor: number, top: number) {
    g.fillStyle(SILHOUETTE.grey).fillRect(360, top, 520, 14).fillRect(380, top + 14, 12, floor - top - 14).fillRect(848, top + 14, 12, floor - top - 14);
}

// slumped at the end of the table, cap on, facing the family
function drawPlayer(g: Phaser.GameObjects.Graphics, floor: number, top: number) {
    g.fillStyle(SILHOUETTE.dark);
    g.fillRect(296, top - 84, 46, 130).fillRect(336, floor - 64, 50, 14).fillRect(372, floor - 64, 14, 64);
    g.fillRect(302, top - 116, 32, 32).fillRect(298, top - 126, 38, 12).fillRect(334, top - 120, 20, 6);
}

function drawFamily(g: Phaser.GameObjects.Graphics, top: number, arms: Arms, phase: number) {
    g.clear();
    for (let i = 0; i < FAMILY; i++) {
        const x = 440 + i * 95;
        const lift = arms === "up" && (i + phase) % 2 ? 8 : 0;
        g.fillStyle(i % 2 ? SILHOUETTE.grey : SILHOUETTE.dark);
        g.fillRect(x - 22, top - 100 - lift, 44, 100 + lift).fillRect(x - 14, top - 132 - lift, 28, 28);
        if (arms !== "down") {
            g.fillRect(x - 34, top - 156 - lift, 10, 70).fillRect(x + 24, top - 156 - lift, 10, 70);
        }
        if (arms === "toast") {
            g.fillRect(x + 22, top - 172, 14, 18);
        }
    }
}

// standing at the grill, chainsaw out over the meat
function drawUncle(scene: Phaser.Scene, floor: number) {
    const g = scene.add.graphics().fillStyle(SILHOUETTE.dark);
    g.fillRect(906, floor - 110, 18, 110).fillRect(936, floor - 110, 18, 110);
    g.fillRoundedRect(896, floor - 252, 70, 146, 20).fillRect(910, floor - 296, 42, 44);
    g.fillRect(950, floor - 218, 46, 14).fillRect(990, floor - 240, 44, 36).fillRect(998, floor - 252, 26, 12);
    g.fillStyle(SILHOUETTE.grey).fillRect(1034, floor - 230, 92, 14);
    return g;
}

function drawDog(scene: Phaser.Scene, floor: number) {
    const g = scene.add.graphics().fillStyle(SILHOUETTE.dark);
    g.fillRect(130, floor - 62, 80, 28).fillRect(200, floor - 84, 30, 26).fillRect(204, floor - 96, 8, 14).fillRect(228, floor - 74, 12, 10);
    g.fillRect(136, floor - 36, 10, 36).fillRect(196, floor - 36, 10, 36).fillRect(116, floor - 76, 16, 6);
    return g;
}
