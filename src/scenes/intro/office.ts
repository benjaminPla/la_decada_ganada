import { DialogBox } from "../../ui/dialogBox";
import Phaser from "phaser";
import { SILHOUETTE, steps } from "../../ui/cinematic";
import { textStyle } from "../../theme";

// script lines fire beats: open lifts the title card, fade closes on black
export type OfficeBeat = "fade" | "fist" | "open" | "write";

type Pose = "fist" | "rest" | "write";

const COLORS = {
    books:   [0x5a2a22, 0x2a3a4a, 0x4a4a2a, 0x3a2a4a, 0x6a4a2a],
    diploma: 0x8a8068,
    floor:   0x1f1610,
    frame:   0x2a1c14,
    lamp:    0xc8a85a,
    lit:     0x8a7a3a,
    night:   0x0e1428,
    rug:     0x3a1e18,
    skyline: 0x080c18,
    wall:    0x3a2a22,
    wood:    0x2a1c14,
} as const;

const v = (x: number, y: number) => new Phaser.Math.Vector2(x, y);

// psychoanalyst's office: the player on the couch, the therapist behind his head taking notes
export function drawOffice(scene: Phaser.Scene) {
    const { width } = scene.scale;
    const height = scene.scale.height - DialogBox.HEIGHT;
    const floor = height - 50;

    const g = scene.add.graphics();
    drawRoom(g, width, height, floor);
    drawCouch(g, floor);
    drawPatient(g, floor);

    const therapist = scene.add.graphics();
    const pose = (p: Pose, phase = 0) => drawTherapist(therapist, floor, p, phase);
    pose("rest");

    const title = scene.add.container(0, 0, [
        scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0),
        scene.add.text(width / 2, height / 2, "AÑO 3 DEL MILEONATO", textStyle("ui", "xl")).setOrigin(0.5),
    ]);
    const blackout = scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0).setAlpha(0);

    const play = (beat: OfficeBeat) => {
        switch (beat) {
            case "fade":
                steps(scene, 4, (i) => blackout.setAlpha((i + 1) / 4));
                break;
            case "fist":
                pose("fist");
                break;
            case "open":
                steps(scene, 4, (i) => title.setAlpha(1 - (i + 1) / 4), () => title.destroy());
                break;
            case "write":
                steps(scene, 12, (i) => pose("write", i), () => pose("rest"));
                break;
        }
    };

    return { play };
}

// ---- background: the only thing with color

function drawRoom(g: Phaser.GameObjects.Graphics, width: number, height: number, floor: number) {
    g.fillStyle(COLORS.wall).fillRect(0, 0, width, floor);
    g.fillStyle(COLORS.floor).fillRect(0, floor, width, height - floor);
    g.fillStyle(COLORS.rug).fillEllipse(760, floor + 22, 620, 34);

    g.fillStyle(COLORS.wood).fillRect(60, 90, 220, floor - 90);
    for (let shelf = 0; shelf < 4; shelf++) {
        const y = 110 + shelf * 90;
        for (let x = 74, i = shelf; x < 250; x += 18, i++) {
            g.fillStyle(COLORS.books[i % COLORS.books.length]).fillRect(x, y + (i % 3) * 6, 14, 70 - (i % 3) * 6);
        }
        g.fillStyle(SILHOUETTE.dark).fillRect(60, y + 70, 220, 8);
    }
    // the chainsaw plush, on top of the shelf
    g.fillStyle(SILHOUETTE.dark).fillRoundedRect(110, 56, 70, 34, 8).fillRect(176, 66, 76, 14).fillRect(120, 46, 36, 12);

    g.fillStyle(COLORS.frame).fillRect(330, 50, 90, 70).fillRect(440, 50, 90, 70);
    g.fillStyle(COLORS.diploma).fillRect(338, 58, 74, 54).fillRect(448, 58, 74, 54);

    g.fillStyle(COLORS.frame).fillRect(1040, 60, 180, 250);
    g.fillStyle(COLORS.night).fillRect(1052, 72, 156, 226);
    g.fillStyle(COLORS.skyline).fillRect(1052, 200, 40, 98).fillRect(1096, 160, 50, 138).fillRect(1150, 220, 58, 78);
    g.fillStyle(COLORS.lit).fillRect(1108, 180, 8, 8).fillRect(1126, 210, 8, 8).fillRect(1166, 240, 8, 8);
    g.fillStyle(COLORS.frame).fillRect(1128, 60, 6, 250);

    g.fillStyle(SILHOUETTE.grey).fillRect(380, 200, 6, floor - 200).fillRect(360, floor - 8, 46, 8);
    g.fillStyle(COLORS.lamp).fillPoints([v(354, 200), v(412, 200), v(398, 160), v(368, 160)], true);
    g.fillStyle(COLORS.lamp, 0.07).fillCircle(383, 230, 220);
}

// ---- figures: silhouettes

function drawCouch(g: Phaser.GameObjects.Graphics, floor: number) {
    g.fillStyle(SILHOUETTE.grey);
    g.fillRect(600, floor - 100, 440, 52).fillRect(612, floor - 48, 14, 48).fillRect(1014, floor - 48, 14, 48);
    g.fillPoints([v(596, floor - 100), v(596, floor - 176), v(640, floor - 182), v(690, floor - 100)], true);
}

function drawPatient(g: Phaser.GameObjects.Graphics, floor: number) {
    g.fillStyle(SILHOUETTE.dark);
    g.fillPoints([v(640, floor - 168), v(690, floor - 182), v(840, floor - 146), v(836, floor - 100), v(660, floor - 100)], true);
    g.fillRect(820, floor - 140, 170, 34).fillRect(980, floor - 174, 20, 42);
    g.fillRect(612, floor - 236, 56, 58).fillRect(632, floor - 182, 22, 18);
    g.fillRect(608, floor - 252, 62, 20).fillRect(664, floor - 246, 34, 7);
    g.fillRect(700, floor - 172, 80, 16);
}

// sits facing right, legs crossed; the arm changes with the pose
function drawTherapist(g: Phaser.GameObjects.Graphics, floor: number, pose: Pose, phase: number) {
    const x = 470;
    const seat = floor - 110;

    g.clear().fillStyle(SILHOUETTE.grey);
    g.fillRect(430, seat - 130, 30, 170).fillRect(430, seat, 130, 40).fillRect(440, floor - 30, 12, 30).fillRect(540, floor - 30, 12, 30);

    g.fillStyle(SILHOUETTE.dark);
    g.fillPoints([v(x, seat), v(x + 46, seat), v(x + 40, seat - 110), v(x + 6, seat - 110)], true);
    g.fillRect(x + 16, seat - 128, 16, 20).fillCircle(x + 26, seat - 148, 24).fillCircle(x + 6, seat - 166, 13);
    g.fillRect(x + 10, seat - 24, 90, 24).fillRect(x + 84, seat - 4, 18, 114).fillRect(x + 72, floor - 8, 40, 8);
    g.fillPoints([v(x + 20, seat - 38), v(x + 100, seat - 30), v(x + 140, seat + 30), v(x + 124, seat + 38), v(x + 92, seat - 6), v(x + 20, seat - 14)], true);

    if (pose === "fist") {
        g.fillRect(x + 42, seat - 210, 16, 114).fillRect(x + 38, seat - 230, 24, 24);
        return;
    }
    const scribble = pose === "write" ? (phase % 2 ? 6 : -4) : 0;
    g.fillPoints([v(x + 34, seat - 100), v(x + 48, seat - 96), v(x + 74, seat - 56), v(x + 62, seat - 48)], true);
    g.fillRect(x + 62, seat - 62, 36, 14);
    g.fillStyle(SILHOUETTE.grey).fillRect(x + 66, seat - 84, 40, 28);
    g.fillStyle(SILHOUETTE.dark).fillRect(x + 84 + scribble, seat - 96, 4, 20);
}
