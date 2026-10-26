import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { type PlaceId, drawPalestineFlag } from "./places";
import { THEME, textStyle, toCss } from "../../theme";
import { UNLOCK_EVENT, isUnlocked } from "../../progress";
import type { Unlockable, UnlockableId } from "../../progress/unlockables";

// maps a real color to what gets painted: itself when unlocked, the silhouette when locked
type Paint = (color: number) => number;

type PlaceObject = {
    draw:  (scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, paint: Paint, locked: boolean) => Phaser.GameObjects.GameObject[];
    place: PlaceId;
};

const COLORS = {
    pin:        0xc81828,
    poster:     0xd8cdb0,
    posterInk:  0x1f3a6b,
    rainbow:    [0xe4312b, 0xf28c28, 0xf2c12e, 0x149954, 0x2f6fd0, 0x7a3fb0],
    silhouette: 0x000000,
} as const;

const SILHOUETTE_ALPHA = 0.28;

const OBJECTS: Record<UnlockableId, PlaceObject> = {
    "bandera-palestina":     { draw: drawWallFlag, place: "room" },
    "consolador-arcoiris":   { draw: drawDildo,    place: "bathroom" },
    "poster-vamos-a-volver": { draw: drawPoster,   place: "room" },
};

// draws the place's objects (locked ones as silhouettes) and swaps them in when unlocked mid-run
export function mountObjects(scene: Phaser.Scene, place: PlaceId, parent: Phaser.GameObjects.Container) {
    const mounted = new Map<UnlockableId, Phaser.GameObjects.Container>();
    const mount = (id: UnlockableId) => {
        mounted.get(id)?.destroy();
        const container = drawObject(scene, id);
        parent.add(container);
        mounted.set(id, container);
    };
    const ids = (Object.keys(OBJECTS) as UnlockableId[]).filter((id) => OBJECTS[id].place === place);
    ids.forEach(mount);

    const onUnlock = ({ id }: Unlockable) => {
        if (ids.includes(id as UnlockableId)) {
            mount(id as UnlockableId);
        }
    };
    scene.game.events.on(UNLOCK_EVENT, onUnlock);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.game.events.off(UNLOCK_EVENT, onUnlock));
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
