import { DialogBox } from "../../ui/dialogBox";
import { LAYOUT } from "./layout";
import Phaser from "phaser";
import { THEME, textStyle, toCss } from "../../theme";
import { isUnlocked } from "../../progress";

const COLORS = {
    baseboard:  0x241a16,
    casing:     0x2a2622,
    casingEdge: 0x14100e,
    knob:       0x6e625a,
    poster:     0xd8cdb0,
    posterInk:  0x1f3a6b,
    screen:     0x0b1a0f,
    screenBar:  0x113a1c,
    stripe:     0x342824,
    wall:       0x3b2e2a,
    wood:       0x5a3a24,
    woodDark:   0x3e2818,
} as const;

const CHART = [0.15, 0.22, 0.18, 0.32, 0.4, 0.36, 0.55, 0.62, 0.58, 0.78, 0.95];

const TICKER = [
    "RIESGO PAÍS ▼ MÍNIMO HISTÓRICO",
    "DÓLAR: QUIETO HACE 14 MESES",
    "SUPERÁVIT FISCAL ▲ OTRA VEZ",
    "MERVAL ▲ +12% EN EL DÍA",
];

export function drawRoom(scene: Phaser.Scene) {
    const { width } = scene.scale;
    const { baseboard, stripe } = LAYOUT.wall;
    const floorY = scene.scale.height - DialogBox.HEIGHT;
    const g = scene.add.graphics();

    g.fillStyle(COLORS.wall).fillRect(0, 0, width, floorY);
    g.fillStyle(COLORS.stripe);
    for (let x = stripe.every / 2; x < width; x += stripe.every) {
        g.fillRect(x, 0, stripe.width, floorY);
    }
    g.fillStyle(COLORS.baseboard).fillRect(0, floorY - baseboard, width, baseboard);

    if (isUnlocked("poster-vamos-a-volver")) {
        drawPoster(scene, g);
    }
}

export function drawTv(scene: Phaser.Scene) {
    const { antenna, cabinet, casing, flicker, panel, scanline, screen, ticker } = LAYOUT.tv;
    const g = scene.add.graphics();
    const centerX = casing.x + (casing.width - panel.width) / 2;
    const s = new Phaser.Geom.Rectangle(
        casing.x + screen.inset,
        casing.y + (casing.height - screen.height) / 2,
        casing.width - screen.inset * 2 - panel.width,
        screen.height,
    );

    // ---- light spill, antenna, cabinet, casing
    g.fillStyle(THEME.colors.phosphor, 0.05).fillEllipse(s.centerX, s.centerY, casing.width * 1.6, casing.height * 1.5);
    g.lineStyle(4, COLORS.casingEdge)
        .lineBetween(centerX, casing.y, centerX - antenna, casing.y - antenna)
        .lineBetween(centerX, casing.y, centerX + antenna, casing.y - antenna);
    g.fillStyle(COLORS.woodDark).fillRect(cabinet.x, cabinet.y, cabinet.width, cabinet.height);
    g.fillStyle(COLORS.wood).fillRect(cabinet.x + 8, cabinet.y + 8, cabinet.width - 16, cabinet.height - 16);
    g.fillStyle(COLORS.casingEdge).fillRoundedRect(casing.x - 4, casing.y - 4, casing.width + 8, casing.height + 8, casing.radius);
    g.fillStyle(COLORS.casing).fillRoundedRect(casing.x, casing.y, casing.width, casing.height, casing.radius);

    // ---- control panel
    const panelX = s.right + (casing.x + casing.width - s.right) / 2;
    g.fillStyle(COLORS.knob).fillCircle(panelX, casing.y + 80, 14).fillCircle(panelX, casing.y + 130, 14);
    g.fillStyle(COLORS.casingEdge);
    for (let i = 0; i < 6; i++) {
        g.fillRect(panelX - 18, casing.y + 180 + i * 12, 36, 4);
    }

    // ---- screen: header, ticker bar, chart
    g.fillStyle(COLORS.screen).fillRoundedRect(s.x, s.y, s.width, s.height, screen.radius);
    g.fillStyle(COLORS.screenBar).fillRect(s.x, s.y + 12, s.width, 28).fillRect(s.x, s.bottom - 48, s.width, 28);

    const chart = new Phaser.Geom.Rectangle(s.x + 16, s.y + 112, s.width - 32, 80);
    g.lineStyle(2, THEME.colors.phosphor, 0.4)
        .lineBetween(chart.left, chart.bottom, chart.right, chart.bottom)
        .lineBetween(chart.left, chart.top, chart.left, chart.bottom);
    g.lineStyle(4, THEME.colors.phosphor).strokePoints(CHART.map((v, i) => new Phaser.Math.Vector2(
        chart.left + (chart.width * i) / (CHART.length - 1),
        chart.bottom - chart.height * v,
    )));

    const small = textStyle("ui", "sm", "phosphor");
    scene.add.text(s.x + 12, s.y + 26, "● EN VIVO", small).setOrigin(0, 0.5);
    scene.add.text(s.right - 12, s.y + 26, "TÑ", small).setOrigin(1, 0.5);
    scene.add.text(s.x + 16, s.y + 52, "MILEÓN: INFLACIÓN 0%", {
        ...textStyle("ui", "md", "phosphor"),
        wordWrap: { width: s.width - 32 },
    });
    scene.add.text(chart.right, chart.top - 8, "▲ +38%", small).setOrigin(1, 1);

    let item = 0;
    const tickerText = scene.add.text(s.x + 12, s.bottom - 34, TICKER[item], small).setOrigin(0, 0.5);
    scene.time.addEvent({
        callback: () => tickerText.setText(TICKER[++item % TICKER.length]),
        delay:    ticker,
        loop:     true,
    });

    // ---- CRT: scanlines and flicker on top of the content
    const crt = scene.add.graphics().fillStyle(0x000000, 0.25);
    for (let y = s.y; y < s.bottom; y += scanline) {
        crt.fillRect(s.x, y, s.width, 1);
    }
    const glow = scene.add.rectangle(s.centerX, s.centerY, s.width, s.height, THEME.colors.phosphor, 0.03);
    scene.tweens.add({ alpha: 0.5, duration: flicker, repeat: -1, targets: glow, yoyo: true });
}

function drawPoster(scene: Phaser.Scene, g: Phaser.GameObjects.Graphics) {
    const { height, width, x, y } = LAYOUT.poster;
    const centerX = x + width / 2;

    g.fillStyle(COLORS.poster).fillRect(x, y, width, height);
    g.fillStyle(THEME.colors.accent).fillRect(x, y, width, 20).fillRect(x, y + height - 20, width, 20);
    g.fillStyle(THEME.colors.ink).fillCircle(centerX, y + 6, 5);

    scene.add.text(centerX, y + 64, "CFK", { ...textStyle("ui", "xl"), color: toCss(COLORS.posterInk) }).setOrigin(0.5);
    scene.add.text(centerX, y + 120, "VAMOS\nA VOLVER", {
        ...textStyle("ui", "sm"),
        align: "center",
        color: toCss(COLORS.posterInk),
    }).setOrigin(0.5);
}
