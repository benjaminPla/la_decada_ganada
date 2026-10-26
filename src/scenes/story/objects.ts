import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { type PlaceId, drawPalestineFlag } from "./places";
import { THEME, textStyle, toCss } from "../../theme";
import type { UnlockableId } from "../../progress/unlockables";
import { isUnlocked } from "../../progress";

// maps a real color to what gets painted: itself when unlocked, the silhouette when locked
type Paint = (color: number) => number;

type PlaceObject = {
    draw:  (scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, paint: Paint, locked: boolean) => Phaser.GameObjects.GameObject[];
    place: PlaceId;
};

const COLORS = {
    bronze:     0x9a7a3a,
    bronzeDark: 0x6a5228,
    capital:    0xa8201a,
    gold:       0xd8b048,
    pin:        0xc81828,
    poster:     0xd8cdb0,
    posterInk:  0x1f3a6b,
    rainbow:    [0xe4312b, 0xf28c28, 0xf2c12e, 0x149954, 0x2f6fd0, 0x7a3fb0],
    silhouette: 0x000000,
} as const;

const SILHOUETTE_ALPHA = 0.28;

const OBJECTS: Record<UnlockableId, PlaceObject> = {
    "bandera-palestina":     { draw: drawWallFlag,   place: "room" },
    "consolador-arcoiris":   { draw: drawDildo,      place: "bathroom" },
    "libro-de-marx":         { draw: drawMarx,       place: "room" },
    "manos-de-peron":        { draw: drawPeronHands, place: "room" },
    "poster-vamos-a-volver": { draw: drawPoster,     place: "room" },
};

// locked objects show as silhouettes; an unlock shows up on the next run
export function mountObjects(scene: Phaser.Scene, place: PlaceId, parent: Phaser.GameObjects.Container) {
    (Object.keys(OBJECTS) as UnlockableId[])
        .filter((id) => OBJECTS[id].place === place)
        .forEach((id) => parent.add(drawObject(scene, id)));
}

function drawObject(scene: Phaser.Scene, id: UnlockableId) {
    const locked = !isUnlocked(id);
    const paint: Paint = locked ? () => COLORS.silhouette : (color) => color;
    const g = scene.add.graphics();
    const container = scene.add.container(0, 0, [g, ...OBJECTS[id].draw(scene, g, paint, locked)]);
    return container.setAlpha(locked ? SILHOUETTE_ALPHA : 1);
}

// ---- room

function drawPoster(scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, paint: Paint, locked: boolean) {
    const { height, width, x, y } = LAYOUT.poster;
    const centerX = x + width / 2;

    g.fillStyle(paint(COLORS.poster)).fillRect(x, y, width, height);
    g.fillStyle(paint(THEME.colors.accent)).fillRect(x, y, width, 20).fillRect(x, y + height - 20, width, 20);
    g.fillStyle(paint(COLORS.pin)).fillCircle(centerX, y + 6, 5);
    if (locked) {
        return [];
    }

    return [
        scene.add.text(centerX, y + 64, "CFK", { ...textStyle("ui", "xl"), color: toCss(COLORS.posterInk) }).setOrigin(0.5),
        scene.add.text(centerX, y + 120, "VAMOS\nA VOLVER", {
            ...textStyle("ui", "sm"),
            align: "center",
            color: toCss(COLORS.posterInk),
        }).setOrigin(0.5),
    ];
}

// «El Capital», cover out, never opened
function drawMarx(scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, paint: Paint, locked: boolean) {
    const { x, y } = LAYOUT.marx;
    const width = 56;
    const height = 74;

    g.fillStyle(paint(COLORS.capital)).fillRect(x, y - height, width, height);
    g.fillStyle(paint(COLORS.gold)).fillRect(x + 4, y - height + 6, width - 8, 3).fillRect(x + 4, y - 9, width - 8, 3);
    if (locked) {
        return [];
    }

    return [scene.add.text(x + width / 2, y - height / 2, "MARX", { ...textStyle("ui", "sm"), color: toCss(COLORS.gold) }).setOrigin(0.5)];
}

// two raised arms on a pedestal: the hands nobody ever found
function drawPeronHands(_scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, paint: Paint) {
    const { x, y } = LAYOUT.peronHands;
    const v = (px: number, py: number) => new Phaser.Math.Vector2(px, py);

    g.fillStyle(paint(COLORS.bronzeDark)).fillRect(x - 28, y - 14, 56, 14);
    g.fillStyle(paint(COLORS.bronze));
    g.fillPoints([v(x - 6, y - 14), v(x - 30, y - 56), v(x - 22, y - 60), v(x + 2, y - 18)], true);
    g.fillPoints([v(x + 6, y - 14), v(x + 30, y - 56), v(x + 22, y - 60), v(x - 2, y - 18)], true);
    g.fillRect(x - 36, y - 72, 16, 16).fillRect(x + 20, y - 72, 16, 16);
    return [];
}

// pinned flat to the wall, behind the player's head
function drawWallFlag(_scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, paint: Paint) {
    const { height, width, x, y } = LAYOUT.flag;

    drawPalestineFlag(g, x, y, width, height, paint);
    g.fillStyle(paint(COLORS.pin))
        .fillCircle(x + 6, y + 6, 5).fillCircle(x + width - 6, y + 6, 5)
        .fillCircle(x + 6, y + height - 6, 5).fillCircle(x + width - 6, y + height - 6, 5);
    return [];
}

// ---- bathroom

// rainbow shaft standing on the bathroom shelf
function drawDildo(_scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, paint: Paint) {
    const { band, x, y } = LAYOUT.dildo;
    const width = 22;
    const top = y - 8 - COLORS.rainbow.length * band;

    g.fillStyle(paint(COLORS.rainbow[0])).fillCircle(x, top, width / 2);
    COLORS.rainbow.forEach((color, i) => g.fillStyle(paint(color)).fillRect(x - width / 2, top + i * band, width, band));
    g.fillStyle(paint(COLORS.rainbow[5])).fillEllipse(x, y - 5, 46, 12);
    return [];
}
