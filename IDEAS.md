# Ideas

## Media to parody

- [ ] LN+ → **LÑ+** (same joke as TN → TÑ). Mock it as having turned ultra K over the last year.

## Unlockable objects

Each one is an entry in `src/progress/unlockables.ts`: an event (`on`) plus a `condition`.

- [x] Póster «Vamos a volver»: first run started.
- [ ] Libro de Marx.
- [ ] Las manos de Perón (on a piece of furniture).
- [ ] Tatuaje de Malvinas.
- [ ] Mate.
- [ ] Sticker de Maradona for the mate. Chain: only unlockable once the mate is unlocked.

```ts
{
    condition:   ({ unlocked }) => unlocked.includes("mate"),
    description: "...",
    id:          "sticker-maradona",
    name:        "Sticker de Maradona",
    on:          "choice-made",
},
```

## Collection / endings

- [ ] Define the endings in `src/progress/endings.ts` and emit `ending-reached` from scenes.
- [ ] Show unlocked objects in the room (the poster already only renders when unlocked).
