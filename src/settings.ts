import Phaser from "phaser";

export type Settings = {
    muted:  boolean;
    volume: number;
};

export const SETTINGS_DEFAULTS: Settings = {
    muted:  true,
    volume: 0.6,
};

export const VOLUME_STEP = 0.2;

const STORAGE_KEY = "la-decada-ganada:settings";

export function getSetting<K extends keyof Settings>(registry: Phaser.Data.DataManager, key: K): Settings[K] {
    return registry.get(key);
}

export function setSetting<K extends keyof Settings>(registry: Phaser.Data.DataManager, key: K, value: Settings[K]) {
    registry.set(key, value);
}

export function initSettings(game: Phaser.Game) {
    const settings = load();
    game.registry.set(settings);
    apply(game, settings);

    game.registry.events.on(Phaser.Data.Events.CHANGE_DATA, () => {
        const current = { muted: getSetting(game.registry, "muted"), volume: getSetting(game.registry, "volume") };
        apply(game, current);
        save(current);
    });
}

function apply(game: Phaser.Game, settings: Settings) {
    game.sound.mute = settings.muted;
    game.sound.volume = settings.volume;
}

function load(): Settings {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
        return {
            muted:  typeof saved.muted === "boolean" ? saved.muted : SETTINGS_DEFAULTS.muted,
            volume: Phaser.Math.Clamp(Number(saved.volume ?? SETTINGS_DEFAULTS.volume) || 0, 0, 1),
        };
    } catch {
        return { ...SETTINGS_DEFAULTS };
    }
}

function save(settings: Settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        // storage blocked or full: keep in-memory settings
    }
}
