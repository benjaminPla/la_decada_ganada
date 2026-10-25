# Ideas

## Objects

Entries in `src/progress/unlockables.ts`: an event (`on`) plus a `condition`.

- **Wall:** [x] Póster «Vamos a volver» (first run) · [ ] Bandera LGBT
- **Furniture (biblioteca):** [ ] Libro de Marx · [ ] Estatua de las manos de Perón. Not unlockable itself: appears with whichever of its objects unlocks first (objects declare `furniture: "shelf"`).
- **Mate:** [ ] Mate → then stickers: [ ] Maradona · [ ] Abuelas de Plaza de Marzo. Stickers require the mate: `condition: ({ unlocked }) => unlocked.includes("mate")`.
- **Body:** [ ] Tatuaje de Malvinas

## Endings

Rule: **you always die on the toilet.** Every ending is the same death; what changes is how you got there. Entries in `src/progress/endings.ts`, reached from story nodes in `src/scenes/intro/script.ts`.

- [ ] **Every ending gets a pixel-art cinematic** (same style as the room and the player): a few animated frames of the death before the "FINAL DESBLOQUEADO" toast. Could be a scene that takes an ending id and plays its frames.

- [x] **Troll del Kremlin:** C6N spins good news as bad → you rage-post on Y → you go viral → Russia pays you to post → TN exposes the troll network → a Siberian hitman gets you on the toilet.
  - [ ] Follower counter that grows on screen while posting.
  - [ ] Phone / Y app scene for the posting part.
  - [ ] Make the "Rechazar Rusia" choice matter (now it only pretends to).
  - [ ] Cinematic: the bathroom door, the Siberian hitman's silhouette, the phone falling.
- [ ] **Vigilia en San José 1111:** a flow where you go camp outside Cristina's house arrest, waiting for her to come out on the balcony. Days of vigil, no bathroom but the chemical ones: she finally waves, the crowd jumps, and the chemical toilet you're in tips over.
  - [ ] Cinematic: the crowd and flags in front of San José 1111, Cristina on the balcony, the row of chemical toilets, yours rocking and tipping over.
- [ ] Next endings: one per first choice (tweet, Cristina), plus mixes.

## Player faces

`Expression` in `src/scenes/intro/types.ts`; story lines set `expression` and it sticks until changed. Angry and furious shake.

- [x] angry · furious · greedy · sad · shocked
- [ ] relieved (C6N calming him down), smug, dead (for the cinematics)

## Mockings

| Real | Parody | Notes |
|---|---|---|
| Javier Milei | Javier Mileón | "el león" |
| Cristina Kirchner | Cristina | first name only; nickname «La Abogada Exitosa» (her own words) |
| Víctor Hugo Morales | Víctor Hugo Inmorales | C6N anchor |
| C5N | C6N | |
| TN - Todo Noticias | TN - Todo Narrativa | keeps the TN initials |
| LN+ | LN- | turned ultra K over the last year |
| X (Twitter) | Y | |
| Abuelas de Plaza de Mayo | Abuelas de Plaza de Marzo | mate sticker |
| Russia / Kremlin | as is | troll farm, hitman |
| Russian handler | Vladimir Retuitov | pays 20 USD per post, "es mucho dinero, ¿da?" |
| INDEC | as is | the "publicó el dato" joke |
