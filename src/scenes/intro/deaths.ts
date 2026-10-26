import { DialogBox } from "../../ui/dialogBox";
import Phaser from "phaser";

export type DeathId = "death-chemical" | "death-gaza" | "death-home";

// story lines fire beats; each death plays the ones it knows and ignores the rest
export type Beat = "aim" | "bang" | "enter" | "shake" | "tip";

// decor: layer above the background and below the figures, for the place's unlockable objects
export type Death = {
    container: Phaser.GameObjects.Container;
    decor:     Phaser.GameObjects.Container;
    play:      (beat: Beat) => void;
};

type Figure = {
    container: Phaser.GameObjects.Container;
    redraw:    (phase: number, aiming: boolean) => void;
    target:    number;
};

const COLORS = {
    blood:        0x4a0808,
    cabinDark:    0x0c1e40,
    door:         0x2a2420,
    doorGap:      0x050505,
    flash:        0xfff4c0,
    gazaFloor:    0x24190d,
    gazaStain:    0x2a1e10,
    gazaTint:     0x5a1a10,
    gazaWall:     0x3a2a18,
    homeFloor:    0x141a1a,
    homeGrout:    0x172020,
    homeWall:     0x1f2a2a,
    light:        0x8a7a3a,
    night:        0x0e1428,
    screen:       0x9fd0ff,
    shadow:       0x0b0b0b,
    shadowGrey:   0x1e1e1e,
} as const;

const FRAME = 140;
const TOILET_X = 960;

export function isDeath(id: string): id is DeathId {
    return id.startsWith("death-");
}

export function drawDeath(scene: Phaser.Scene, id: DeathId): Death {
    switch (id) {
        case "death-chemical": return drawChemical(scene);
        case "death-gaza":     return drawShooting(scene, false);
        case "death-home":     return drawShooting(scene, true);
    }
}

function floorY(scene: Phaser.Scene) {
    return scene.scale.height - DialogBox.HEIGHT - 50;
}

// low frame rate on purpose: n steps, one every FRAME ms
function steps(scene: Phaser.Scene, count: number, onStep: (i: number) => void, onDone?: () => void) {
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

// ---- shared: the player sitting sideways, facing left; a silhouette lit only by the phone

function drawSitter(scene: Phaser.Scene, x: number, seat: number) {
    const g = scene.add.graphics();
    const v = (px: number, py: number) => new Phaser.Math.Vector2(px, py);

    g.fillStyle(COLORS.screen, 0.12).fillCircle(-100, -150, 70);
    g.fillStyle(COLORS.shadow);
    g.fillRect(-150, 85, 50, 15).fillRect(-140, 10, 40, 78).fillRect(-135, -18, 130, 30);
    g.fillPoints([v(-40, -120), v(25, -130), v(30, -10), v(-20, -10)], true);
    g.fillRect(-32, -142, 24, 18).fillRect(-55, -200, 56, 62).fillRect(-62, -182, 30, 10);
    g.fillRect(-55, -218, 58, 22).fillRect(-84, -202, 34, 7).fillRect(-28, -232, 4, 14).fillRect(-48, -236, 44, 6);
    g.fillPoints([v(-30, -112), v(-8, -112), v(-40, -62), v(-62, -70)], true);
    g.fillRect(-115, -74, 70, 16).fillRect(-128, -100, 16, 34);
    g.fillStyle(COLORS.screen).fillRect(-126, -97, 12, 26);

    return scene.add.container(x, seat, [g]);
}

function drawToilet(g: Phaser.GameObjects.Graphics, floor: number) {
    const x = TOILET_X;
    g.fillStyle(COLORS.shadow);
    g.fillRect(x + 48, floor - 180, 40, 92).fillRoundedRect(x - 62, floor - 102, 120, 32, 8).fillRect(x - 30, floor - 70, 55, 70);
}

function drawVignette(g: Phaser.GameObjects.Graphics, width: number, height: number) {
    for (let i = 0; i < 4; i++) {
        const inset = i * 24;
        g.fillStyle(COLORS.shadow, 0.12)
            .fillRect(0, 0, width, 24 + inset).fillRect(0, height - 24 - inset, width, 24 + inset)
            .fillRect(0, 0, 24 + inset, height).fillRect(width - 24 - inset, 0, 24 + inset, height);
    }
}

// ---- figures: all silhouettes, facing right, feet at (0, 0)

function drawRussian(scene: Phaser.Scene, x: number, target: number): Figure {
    const g = scene.add.graphics();
    const redraw = (phase: number, aiming: boolean) => {
        const stride = phase % 2 ? 10 : -10;
        g.clear().fillStyle(COLORS.shadow);
        g.fillRect(-18 + stride, -110, 14, 110).fillRect(4 - stride, -110, 14, 110);
        g.fillStyle(COLORS.shadowGrey).fillPoints([
            new Phaser.Math.Vector2(-30, -232), new Phaser.Math.Vector2(30, -232),
            new Phaser.Math.Vector2(38, -96), new Phaser.Math.Vector2(-38, -96),
        ], true);
        g.fillStyle(COLORS.shadow).fillRect(-16, -270, 32, 40);
        g.fillRect(-26, -294, 52, 28).fillRect(-28, -270, 8, 24).fillRect(20, -270, 8, 24);
        if (aiming) {
            g.fillRect(10, -218, 92, 14).fillRect(100, -224, 28, 12).fillRect(100, -214, 10, 18);
        } else {
            g.fillRect(18, -226, 14, 100);
        }
    };
    redraw(0, false);
    return { container: scene.add.container(x, floorY(scene), [g]), redraw, target };
}

function drawMilitant(scene: Phaser.Scene, x: number, target: number, color: number): Figure {
    const g = scene.add.graphics();
    const redraw = (phase: number, aiming: boolean) => {
        const stride = phase % 2 ? 9 : -9;
        g.clear().fillStyle(color);
        g.fillRect(-16 + stride, -104, 13, 104).fillRect(3 - stride, -104, 13, 104);
        g.fillRect(-26, -220, 52, 120);
        g.fillRect(-15, -260, 30, 40);
        g.fillRect(-20, -268, 40, 16).fillRect(-30, -256, 12, 46);
        const lift = aiming ? 0 : 24;
        g.fillRect(-24, -196 + lift, 30, 14).fillRect(6, -192 + lift, 104, 8).fillRect(36, -186 + lift, 10, 24);
        g.fillRect(14, -206 + lift, 12, 30);
    };
    redraw(0, false);
    return { container: scene.add.container(x, floorY(scene), [g]), redraw, target };
}

// ---- home and gaza: sitting, the door opens, someone walks in, aims, bang

function drawShooting(scene: Phaser.Scene, home: boolean): Death {
    const { width } = scene.scale;
    const height = scene.scale.height - DialogBox.HEIGHT;
    const floor = floorY(scene);
    const g = scene.add.graphics();

    g.fillStyle(home ? COLORS.homeWall : COLORS.gazaWall).fillRect(0, 0, width, height);
    if (home) {
        g.fillStyle(COLORS.homeGrout);
        for (let x = 0; x < width; x += 48) {
            g.fillRect(x, 0, 2, floor);
        }
        for (let y = 0; y < floor; y += 48) {
            g.fillRect(0, y, width, 2);
        }
    } else {
        g.fillStyle(COLORS.gazaStain).fillEllipse(420, 140, 220, 90).fillEllipse(760, 320, 160, 120).fillEllipse(1180, 90, 200, 70);
    }
    g.fillStyle(home ? COLORS.homeFloor : COLORS.gazaFloor).fillRect(0, floor, width, height - floor);
    g.lineStyle(2, COLORS.shadow).lineBetween(620, 0, 620, 60);
    g.fillStyle(COLORS.light).fillCircle(620, 70, 10);
    g.fillStyle(COLORS.light, 0.06).fillCircle(620, 70, 260);
    drawToilet(g, floor);
    if (home) {
        g.fillStyle(COLORS.door).fillRect(470, 210, 140, 10).fillRect(482, 220, 8, 18).fillRect(590, 220, 8, 18);
    }
    const decor = scene.add.container(0, 0);

    const door = scene.add.graphics();
    const drawDoor = (open: boolean) => {
        door.clear().fillStyle(COLORS.doorGap).fillRect(90, floor - 310, 140, 310);
        door.fillStyle(COLORS.door).fillRect(90, floor - 310, open ? 24 : 140, 310);
    };
    drawDoor(false);

    const sitter = drawSitter(scene, TOILET_X, floor - 102);
    const killers = home
        ? [drawRussian(scene, -80, 600)]
        : [
            drawMilitant(scene, -80, 380, COLORS.shadowGrey),
            drawMilitant(scene, -160, 480, COLORS.shadow),
            drawMilitant(scene, -240, 560, COLORS.shadowGrey),
            drawMilitant(scene, -320, 660, COLORS.shadow),
        ];

    const over = scene.add.graphics();
    if (!home) {
        over.fillStyle(COLORS.gazaTint, 0.18).fillRect(0, 0, width, height);
    }
    drawVignette(over, width, height);
    const flash = scene.add.rectangle(0, 0, width, height, COLORS.flash).setOrigin(0).setAlpha(0);
    const blackout = scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0).setAlpha(0);

    const container = scene.add.container(0, 0, [g, decor, door, ...killers.map((k) => k.container), sitter, over, flash, blackout]);

    const play = (beat: Beat) => {
        switch (beat) {
            case "enter":
                drawDoor(true);
                killers.forEach((k) => {
                    const count = Math.ceil((k.target - k.container.x) / 40);
                    steps(scene, count, (i) => {
                        k.container.x = Math.min(k.target, k.container.x + 40);
                        k.redraw(i, false);
                    });
                });
                break;
            case "aim":
                killers.forEach((k) => {
                    k.container.x = k.target;
                    k.redraw(0, true);
                });
                break;
            case "bang": {
                const blood = scene.add.graphics().fillStyle(COLORS.blood);
                for (let i = 0; i < 9; i++) {
                    blood.fillRect(TOILET_X + 20 + (i * 37) % 90, floor - 300 + (i * 53) % 140, 6 + (i % 3) * 4, 6 + (i % 2) * 6);
                }
                container.addAt(blood, 2);
                const muzzles = scene.add.graphics().fillStyle(COLORS.flash);
                killers.forEach((k) => muzzles.fillCircle(k.container.x + (home ? 132 : 114), k.container.y + (home ? -218 : -188), 14));
                container.add(muzzles);
                flash.setAlpha(0.9);
                steps(scene, 3, (i) => {
                    flash.setAlpha([0.5, 0.2, 0][i]);
                    sitter.rotation = [0.12, 0.28, 0.4][i];
                }, () => {
                    muzzles.destroy();
                    steps(scene, 4, (i) => blackout.setAlpha((i + 1) / 4));
                });
                break;
            }
        }
    };

    return { container, decor, play };
}

// ---- cristina: inside the chemical toilet; the crowd jumps, the screen shakes, it tips over

function drawChemical(scene: Phaser.Scene): Death {
    const { width } = scene.scale;
    const height = scene.scale.height - DialogBox.HEIGHT;
    const floor = floorY(scene);
    const g = scene.add.graphics();

    g.fillStyle(COLORS.night).fillRect(0, 0, width, height);
    g.fillStyle(COLORS.light, 0.5).fillRect(80, 40, 90, 60);
    g.fillStyle(COLORS.light, 0.08).fillCircle(125, 70, 180);
    g.fillStyle(COLORS.shadow).fillRect(0, floor, width, height - floor);

    const crowd = scene.add.graphics();
    const drawCrowd = (phase: number) => {
        crowd.clear();
        for (let i = 0; i < 16; i++) {
            const x = 30 + i * 46;
            const jump = (i + phase) % 2 ? 22 : 0;
            const base = floor - jump;
            crowd.fillStyle(i % 2 ? COLORS.shadow : COLORS.shadowGrey);
            crowd.fillRect(x - 14, base - 150, 28, 150).fillRect(x - 11, base - 178, 22, 26);
            crowd.fillRect(x - 20, base - 210, 6, 70).fillRect(x + 14, base - 210, 6, 70);
            if (i % 5 === 2) {
                crowd.fillRect(x + 18, base - 250, 44, 28);
            }
        }
    };
    drawCrowd(0);

    // ---- cut-away cabin, pivoting on its bottom-left corner so it tips over onto the crowd
    const cabin = scene.add.graphics();
    cabin.fillStyle(COLORS.cabinDark).fillRect(0, -360, 300, 360);
    cabin.fillStyle(COLORS.shadow).fillRect(-10, -380, 320, 22).fillRect(-10, -360, 12, 360).fillRect(298, -360, 12, 360);
    cabin.fillRect(150, -100, 140, 100);
    const sitter = drawSitter(scene, 210, -100);
    const tipping = scene.add.container(790, floor, [cabin, sitter]);

    const over = scene.add.graphics();
    drawVignette(over, width, height);
    const blackout = scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0).setAlpha(0);

    const decor = scene.add.container(0, 0);
    const container = scene.add.container(0, 0, [g, decor, crowd, tipping, over, blackout]);

    const play = (beat: Beat) => {
        switch (beat) {
            case "shake":
                scene.cameras.main.shake(1400, 0.02);
                steps(scene, 10, (i) => {
                    drawCrowd(i);
                    tipping.rotation = i % 2 ? -0.04 : 0.03;
                }, () => { tipping.rotation = 0 });
                break;
            case "tip":
                scene.cameras.main.shake(500, 0.03);
                steps(scene, 5, (i) => { tipping.rotation = -[0.15, 0.4, 0.8, 1.25, Math.PI / 2][i] }, () => {
                    steps(scene, 4, (i) => blackout.setAlpha((i + 1) / 4));
                });
                break;
        }
    };

    return { container, decor, play };
}
