import type { DeathId } from "./deaths";
import { DialogBox } from "../../ui/dialogBox";
import Phaser from "phaser";
import { textStyle, toCss } from "../../theme";

export type PlaceId = DeathId | "bathroom" | "boat" | "colonia" | "gaza" | "gaza-bathroom" | "room" | "san-jose";

const COLORS = {
    balcony:       0x2a2622,
    bombo:         0xe8e2d0,
    building:      0xc9b48e,
    buildingDark:  0xa38f6b,
    celeste:       0x74acdf,
    chemical:      0x2f6fd0,
    chemicalDark:  0x1f4f9f,
    coat:          0xf2c12e,
    cobble:        0x7a6e62,
    cobbleDark:    0x5e544a,
    crowd:         [0x3a2c26, 0x4a3a30, 0x2e2420, 0x56443a],
    facade:        0xcfc3a8,
    facadeDark:    0xa89c82,
    flagBlack:     0x111111,
    flagGreen:     0x149954,
    flagRed:       0xe4312b,
    flagWhite:     0xf2f2f2,
    hair:          0x9a6a3a,
    house:         0xe6d2a8,
    houseRoof:     0xa0522d,
    hull:          0xece6d6,
    hullStripe:    0x1f5f8b,
    laundry:       [0xf2c12e, 0x2f6fd0, 0xe4312b],
    lighthouse:    0xf4f0e4,
    night:         0x1c2440,
    plaster:       0xb8a88a,
    plasterCrack:  0x7a6a50,
    porcelain:     0xf4f4f0,
    porcelainEdge: 0xb8bcbc,
    river:         0x8a6e4a,
    riverLight:    0xa88a62,
    sand:          0xd9b77e,
    sea:           0x1f5f8b,
    seaLight:      0x4f8fbf,
    shoes:         0x2a2a2a,
    sign:          0xf4f0e4,
    signInk:       0xc81828,
    skin:          0xf0c8a8,
    skyDay:        0x8cc4e8,
    skyDusk:       0xf0a070,
    skyWarm:       0xe8c48a,
    streetLight:   0xf6e27a,
    sun:           0xf6e27a,
    tile:          0xcfe3e0,
    tileGrout:     0xa9c4c0,
    window:        0x3a3026,
    wood:          0x5a3a24,
    woodDark:      0x3e2818,
} as const;

const HORIZON = 300;

export function drawPlace(scene: Phaser.Scene, id: Exclude<PlaceId, DeathId | "room">) {
    switch (id) {
        case "bathroom":      return drawBathroom(scene, true);
        case "boat":          return drawBoat(scene);
        case "colonia":       return drawColonia(scene);
        case "gaza":          return drawGaza(scene);
        case "gaza-bathroom": return drawBathroom(scene, false);
        case "san-jose":      return drawSanJose(scene);
    }
}

function floorY(scene: Phaser.Scene) {
    return scene.scale.height - DialogBox.HEIGHT;
}

// ---- boat

function drawBoat(scene: Phaser.Scene) {
    const { width } = scene.scale;
    const deck = 400;
    const g = scene.add.graphics();

    g.fillStyle(COLORS.skyDay).fillRect(0, 0, width, HORIZON);
    g.fillStyle(COLORS.sun).fillCircle(1100, 90, 40);
    g.fillStyle(COLORS.sea).fillRect(0, HORIZON, width, floorY(scene) - HORIZON);
    g.fillStyle(COLORS.seaLight);
    for (let row = 0, y = HORIZON + 24; y < floorY(scene); row++, y += 36) {
        for (let x = (row % 2) * 60; x < width; x += 120) {
            g.fillRect(x, y, 48, 4);
        }
    }

    g.fillStyle(COLORS.hull).fillPoints([
        new Phaser.Math.Vector2(40, deck),
        new Phaser.Math.Vector2(780, deck),
        new Phaser.Math.Vector2(720, 500),
        new Phaser.Math.Vector2(100, 500),
    ], true);
    g.fillStyle(COLORS.hullStripe).fillRect(70, 440, 680, 10);
    g.fillStyle(COLORS.woodDark).fillRect(476, 80, 8, deck - 80);
    g.fillStyle(COLORS.hull).fillTriangle(492, 100, 492, 360, 700, 360);
    drawPalestineFlag(g, 400, 84, 72, 42);

    return scene.add.container(0, 0, [g, ...drawGreta(scene, g, 220, deck)]);
}

// yellow raincoat and braids, holding the sign up; feet at (x, ground)
function drawGreta(scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, x: number, ground: number) {
    const headY = ground - 132;

    g.fillStyle(COLORS.shoes).fillRect(x - 20, ground - 30, 14, 30).fillRect(x + 6, ground - 30, 14, 30);
    g.fillStyle(COLORS.coat).fillRect(x - 30, ground - 110, 60, 84);
    g.fillStyle(COLORS.coat).fillRect(x - 44, ground - 190, 14, 84).fillRect(x + 30, ground - 190, 14, 84);
    g.fillStyle(COLORS.skin).fillCircle(x, headY, 22);
    g.fillStyle(COLORS.hair).fillRect(x - 24, headY - 24, 48, 14).fillRect(x - 28, headY - 14, 10, 60).fillRect(x + 18, headY - 14, 10, 60);
    g.fillStyle(COLORS.sign).fillRect(x - 80, ground - 290, 160, 72);

    return [
        scene.add.text(x, ground - 254, "HOW DARE\nYOU!", {
            ...textStyle("ui", "md"),
            align: "center",
            color: toCss(COLORS.signInk),
        }).setOrigin(0.5),
    ];
}

// three bands with the red triangle at the hoist; paint lets objects draw it as a silhouette
export function drawPalestineFlag(g: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, paint = (color: number) => color) {
    const band = height / 3;
    g.fillStyle(paint(COLORS.flagBlack)).fillRect(x, y, width, band);
    g.fillStyle(paint(COLORS.flagWhite)).fillRect(x, y + band, width, band);
    g.fillStyle(paint(COLORS.flagGreen)).fillRect(x, y + band * 2, width, band);
    g.fillStyle(paint(COLORS.flagRed)).fillTriangle(x, y, x, y + height, x + width / 3, y + height / 2);
}

// ---- gaza

function drawGaza(scene: Phaser.Scene) {
    const { width } = scene.scale;
    const ground = 430;
    const g = scene.add.graphics();

    g.fillStyle(COLORS.skyWarm).fillRect(0, 0, width, ground);
    g.fillStyle(COLORS.sun).fillCircle(180, 90, 46);

    const buildings = [
        { height: 220, width: 180, x: 20 },
        { height: 300, width: 150, x: 220 },
        { height: 180, width: 200, x: 390 },
        { height: 260, width: 160, x: 610 },
        { height: 200, width: 220, x: 1040 },
    ];
    buildings.forEach(({ height, width: w, x }, i) => {
        const top = ground - height;
        g.fillStyle(i % 2 ? COLORS.buildingDark : COLORS.building).fillRect(x, top, w, height);
        g.fillStyle(COLORS.window);
        for (let wy = top + 24; wy < ground - 40; wy += 52) {
            for (let wx = x + 20; wx < x + w - 30; wx += 44) {
                g.fillRect(wx, wy, 22, 28);
            }
        }
    });
    g.fillStyle(COLORS.skyWarm).fillTriangle(220, 130, 300, 130, 220, 200);
    g.lineStyle(2, COLORS.window).lineBetween(200, 260, 390, 240);
    COLORS.laundry.forEach((color, i) => g.fillStyle(color).fillRect(240 + i * 50, 252 - i * 5, 18, 24));
    g.fillStyle(COLORS.sand).fillRect(0, ground, width, floorY(scene) - ground);
    g.fillStyle(COLORS.buildingDark).fillRect(560, ground - 20, 50, 20).fillRect(590, ground - 34, 30, 14);
    drawPalestineFlag(g, 640, ground - 300, 60, 36);
    g.fillStyle(COLORS.woodDark).fillRect(636, ground - 300, 4, 40);

    return scene.add.container(0, 0, [g]);
}

// ---- colonia: the river, the lighthouse and the Buquebus that got you here

function drawColonia(scene: Phaser.Scene) {
    const { width } = scene.scale;
    const shore = 400;
    const g = scene.add.graphics();

    g.fillStyle(COLORS.skyDusk).fillRect(0, 0, width, HORIZON);
    g.fillStyle(COLORS.sun).fillCircle(900, HORIZON - 10, 50);
    g.fillStyle(COLORS.river).fillRect(0, HORIZON, width, shore - HORIZON);
    g.fillStyle(COLORS.riverLight);
    for (let row = 0, y = HORIZON + 16; y < shore; row++, y += 24) {
        for (let x = (row % 2) * 50; x < width; x += 100) {
            g.fillRect(x, y, 40, 3);
        }
    }

    // ---- buquebus on the horizon
    g.fillStyle(COLORS.hull).fillRect(560, HORIZON - 34, 220, 30).fillRect(600, HORIZON - 54, 140, 20);
    g.fillStyle(COLORS.hullStripe).fillRect(560, HORIZON - 14, 220, 6);

    // ---- lighthouse
    g.fillStyle(COLORS.lighthouse).fillRect(80, 120, 60, shore - 120);
    g.fillStyle(COLORS.houseRoof).fillRect(80, 180, 60, 16).fillRect(80, 260, 60, 16);
    g.fillStyle(COLORS.window).fillRect(72, 100, 76, 20);
    g.fillStyle(COLORS.streetLight).fillRect(92, 104, 36, 12);

    // ---- old town houses and cobblestones
    [{ x: 200, w: 140 }, { x: 350, w: 120 }].forEach(({ w, x }) => {
        g.fillStyle(COLORS.house).fillRect(x, shore - 110, w, 110);
        g.fillStyle(COLORS.houseRoof).fillTriangle(x - 10, shore - 110, x + w + 10, shore - 110, x + w / 2, shore - 160);
        g.fillStyle(COLORS.window).fillRect(x + w / 2 - 15, shore - 60, 30, 60);
    });
    g.fillStyle(COLORS.cobble).fillRect(0, shore, width, floorY(scene) - shore);
    g.fillStyle(COLORS.cobbleDark);
    for (let row = 0, y = shore + 10; y < floorY(scene); row++, y += 22) {
        for (let x = (row % 2) * 20; x < width; x += 40) {
            g.fillRect(x, y, 30, 4);
        }
    }

    return scene.add.container(0, 0, [g]);
}

// ---- san josé 1111: the balcony, the crowd and the row of chemical toilets

function drawSanJose(scene: Phaser.Scene) {
    const { width } = scene.scale;
    const street = 420;
    const g = scene.add.graphics();

    g.fillStyle(COLORS.night).fillRect(0, 0, width, street);
    g.fillStyle(COLORS.facade).fillRect(140, 20, 520, street - 20);
    g.fillStyle(COLORS.facadeDark);
    for (let y = 50; y < street - 60; y += 90) {
        for (let x = 180; x < 640; x += 110) {
            g.fillRect(x, y, 50, 60);
        }
    }

    // ---- the balcony, lit and empty
    g.fillStyle(COLORS.streetLight).fillRect(330, 120, 120, 90);
    g.fillStyle(COLORS.balcony).fillRect(310, 210, 160, 10);
    for (let x = 314; x < 470; x += 16) {
        g.fillRect(x, 210, 4, 40);
    }
    g.fillRect(310, 248, 160, 6);
    g.fillStyle(COLORS.celeste).fillRect(170, 60, 90, 20).fillRect(170, 100, 90, 20);
    g.fillStyle(COLORS.hull).fillRect(170, 80, 90, 20);

    // ---- chemical toilets
    for (let i = 0; i < 4; i++) {
        const x = 680 + i * 70;
        g.fillStyle(COLORS.chemical).fillRect(x, street - 150, 60, 150);
        g.fillStyle(COLORS.chemicalDark).fillRect(x, street - 160, 60, 14).fillRect(x + 10, street - 120, 40, 110);
        g.fillStyle(COLORS.streetLight).fillRect(x + 42, street - 70, 6, 6);
    }

    // ---- the crowd and its bombos
    g.fillStyle(COLORS.cobbleDark).fillRect(0, street, width, floorY(scene) - street);
    for (let i = 0; i < 18; i++) {
        const x = 20 + i * 36 + (i % 3) * 6;
        const y = street + 30 + (i % 2) * 22;
        g.fillStyle(COLORS.crowd[i % COLORS.crowd.length]).fillCircle(x, y - 26, 14).fillRect(x - 16, y - 14, 32, 60);
    }
    g.fillStyle(COLORS.bombo).fillEllipse(120, street + 70, 60, 40).fillEllipse(480, street + 74, 60, 40);

    return scene.add.container(0, 0, [g]);
}

// ---- bathroom: home gets tiles and the shelf for its objects; gaza gets bare plaster

function drawBathroom(scene: Phaser.Scene, home: boolean) {
    const { width } = scene.scale;
    const floor = floorY(scene);
    const g = scene.add.graphics();

    if (home) {
        g.fillStyle(COLORS.tile).fillRect(0, 0, width, floor);
        g.fillStyle(COLORS.tileGrout);
        for (let x = 0; x < width; x += 48) {
            g.fillRect(x, 0, 2, floor);
        }
        for (let y = 0; y < floor; y += 48) {
            g.fillRect(0, y, width, 2);
        }
    } else {
        g.fillStyle(COLORS.plaster).fillRect(0, 0, width, floor);
        g.lineStyle(2, COLORS.plasterCrack)
            .lineBetween(620, 0, 590, 90).lineBetween(590, 90, 640, 160).lineBetween(640, 160, 610, 230);
        g.lineStyle(2, COLORS.shoes).lineBetween(400, 0, 400, 70);
        g.fillStyle(COLORS.sun).fillCircle(400, 84, 14);
    }

    // ---- toilet
    const x = 300;
    g.fillStyle(COLORS.porcelainEdge).fillRoundedRect(x - 64, 236, 128, 104, 10);
    g.fillStyle(COLORS.porcelain).fillRoundedRect(x - 58, 242, 116, 92, 8);
    g.fillStyle(COLORS.porcelainEdge).fillEllipse(x, 372, 188, 52);
    g.fillStyle(COLORS.porcelain).fillEllipse(x, 368, 176, 44);
    g.fillStyle(COLORS.porcelain).fillRect(x - 50, 380, 100, 100);
    g.fillStyle(COLORS.porcelainEdge).fillRect(x - 60, 476, 120, 10);

    if (home) {
        drawShelf(g, 470, 210);
    }

    return scene.add.container(0, 0, [g]);
}

function drawShelf(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    g.fillStyle(COLORS.wood).fillRect(x, y, 140, 10);
    g.fillStyle(COLORS.woodDark).fillRect(x + 12, y + 10, 8, 18).fillRect(x + 120, y + 10, 8, 18);
}
