import Phaser from "phaser";

type Point = Phaser.Math.Vector2;

const point = (x: number, y: number): Point => new Phaser.Math.Vector2(x, y);

export function drawGear(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, holeColor: number) {
    const teeth = 8;
    const inner = size * 0.3;
    const outer = size * 0.5;
    const half = size * 0.09;

    g.fillStyle(color);
    for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const corner = (r: number, side: number) => point(x + cos * r - sin * side, y + sin * r + cos * side);
        g.fillPoints([corner(inner, -half), corner(outer, -half), corner(outer, half), corner(inner, half)], true);
    }
    g.fillCircle(x, y, size * 0.36);
    g.fillStyle(holeColor);
    g.fillCircle(x, y, size * 0.14);
}

export function drawSpeaker(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, muted: boolean) {
    const left = x - size * 0.5;

    g.fillStyle(color);
    g.fillRect(left, y - size * 0.15, size * 0.22, size * 0.3);
    g.fillPoints([
        point(left + size * 0.2, y - size * 0.15),
        point(left + size * 0.5, y - size * 0.42),
        point(left + size * 0.5, y + size * 0.42),
        point(left + size * 0.2, y + size * 0.15),
    ], true);

    g.lineStyle(2, color);
    if (muted) {
        g.lineBetween(x + size * 0.12, y - size * 0.2, x + size * 0.48, y + size * 0.2);
        g.lineBetween(x + size * 0.12, y + size * 0.2, x + size * 0.48, y - size * 0.2);
        return;
    }
    for (const radius of [size * 0.22, size * 0.42]) {
        g.beginPath();
        g.arc(x + size * 0.02, y, radius, -0.8, 0.8);
        g.strokePath();
    }
}
