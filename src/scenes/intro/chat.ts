import { DialogBox } from "../../ui/dialogBox";
import type { IntroBeat, Opening } from "./types";
import Phaser from "phaser";
import { SILHOUETTE } from "../../ui/cinematic";
import { drawSitter } from "../story/deaths";
import { textStyle } from "../../theme";

// one message per next beat; members changes the header count
type Entry = {
    from?:    string;
    members?: number;
    mine?:    boolean;
    text:     string;
};

const CHAT: readonly Entry[] = [
    { from: "El Tano", text: "[sticker de un león]" },
    { from: "Rulo", text: "RIESGO PAÍS 400 PUNTOS" },
    { mine: true, text: "che nadie va a decir nada del ajuste?" },
    { members: 13, text: "El Tano salió del grupo" },
    { members: 12, text: "Rulo salió del grupo" },
    { members: 2, text: "Pichi, Mauri y 8 más salieron del grupo" },
    { mine: true, text: "bueno, quedamos los que quedamos" },
    { text: "Mamá reaccionó con un león a tu mensaje" },
    { members: 1, text: "Mamá salió del grupo" },
];

const COLORS = {
    avatar:  0x6a7a80,
    bed:     SILHOUETTE.grey,
    bubble:  0x202c33,
    chat:    0x0b141a,
    floor:   0x110d0b,
    frame:   0x050505,
    header:  0x1f2c34,
    mine:    0x005c4b,
    moon:    0xe8e2c0,
    night:   0x0e1428,
    sill:    0x2a2420,
    system:  0x182229,
    wall:    0x18203a,
} as const;

const MEMBERS = 14;

const PHONE = {
    bubble: 260,
    header: 60,
    pad:    8,
    width:  400,
    x:      760,
    y:      16,
} as const;

// sunday night in bed, the phone blown up on the right as the group empties
export function drawChat(scene: Phaser.Scene): Opening {
    const { width } = scene.scale;
    const height = scene.scale.height - DialogBox.HEIGHT;
    const floor = height - 50;

    const g = scene.add.graphics();
    g.fillStyle(COLORS.wall).fillRect(0, 0, width, floor);
    g.fillStyle(COLORS.floor).fillRect(0, floor, width, height - floor);
    g.fillStyle(COLORS.sill).fillRect(80, 60, 220, 190);
    g.fillStyle(COLORS.night).fillRect(92, 72, 196, 166);
    g.fillStyle(COLORS.moon).fillCircle(240, 112, 18);
    g.fillStyle(COLORS.sill).fillRect(186, 72, 6, 166);
    g.fillStyle(COLORS.bed).fillRect(150, floor - 200, 26, 200).fillRect(176, floor - 104, 470, 44).fillRect(630, floor - 60, 16, 60);
    drawSitter(scene, 600, floor - 100);

    const screenX = PHONE.x + 16;
    const screenW = PHONE.width - 32;
    const top = PHONE.y + 16;
    const bottom = height - 40;
    g.fillStyle(COLORS.frame).fillRoundedRect(PHONE.x, PHONE.y, PHONE.width, bottom - PHONE.y + 16, 28);
    g.fillStyle(COLORS.chat).fillRect(screenX, top, screenW, bottom - top);
    g.fillStyle(COLORS.header).fillRect(screenX, top, screenW, PHONE.header);
    g.fillStyle(COLORS.avatar).fillCircle(screenX + 32, top + PHONE.header / 2, 20);
    scene.add.text(screenX + 64, top + 10, "Los pibes del secu", textStyle("ui", "sm"));
    const count = scene.add.text(screenX + 64, top + 32, "", textStyle("ui", "sm", "textMuted"));
    const messages = scene.add.container(0, 0);

    let shown = 0;
    const render = () => {
        const visible = CHAT.slice(0, shown);
        const members = visible.reduce((n, { members }) => members ?? n, MEMBERS);
        count.setText(`${members} participante${members === 1 ? "" : "s"}`);
        messages.removeAll(true);

        let y = bottom - PHONE.pad;
        for (const entry of [...visible].reverse()) {
            const system = !entry.from && !entry.mine;
            const wrap = system ? screenW - 4 * PHONE.pad : PHONE.bubble;
            const text = scene.add.text(0, 0, entry.from ? `${entry.from}\n${entry.text}` : entry.text, {
                ...textStyle("ui", "sm", system ? "textMuted" : "text"),
                align:    system ? "center" : "left",
                wordWrap: { width: wrap },
            });
            const w = text.width + 2 * PHONE.pad;
            const h = text.height + 2 * PHONE.pad;
            y -= h;
            if (y < top + PHONE.header + PHONE.pad) {
                text.destroy();
                break;
            }
            const x = system ? screenX + (screenW - w) / 2 : entry.mine ? screenX + screenW - PHONE.pad - w : screenX + PHONE.pad;
            const color = system ? COLORS.system : entry.mine ? COLORS.mine : COLORS.bubble;
            messages.add([scene.add.rectangle(x, y, w, h, color).setOrigin(0), text.setPosition(x + PHONE.pad, y + PHONE.pad)]);
            y -= PHONE.pad;
        }
    };
    render();

    const play = (beat: IntroBeat) => {
        if (beat === "next" && shown < CHAT.length) {
            shown++;
            render();
        }
    };

    return { play };
}
