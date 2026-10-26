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
  - [x] Make the "Rechazar Rusia" choice matter: Russia asks three times (20 USD, 200 USD, Sochi); caught only if fame + money ≥ 7, with escapes (fueros, Uruguay).
  - [ ] Cinematic: the bathroom door, the Siberian hitman's silhouette, the phone falling.
- [x] **Vigilia en San José 1111:** a flow where you go camp outside Cristina's house arrest, waiting for her to come out on the balcony. Days of vigil, no bathroom but the chemical ones: she finally waves, the crowd jumps, and the chemical toilet you're in tips over.
  - [ ] Cinematic: the crowd and flags in front of San José 1111, Cristina on the balcony, the row of chemical toilets, yours rocking and tipping over.
- [x] **Flotilla de la Libertad:** tweeting for Palestine + kufiya (communism ≥ 5) → Greta Thumbers invites you to the Gaza flotilla → Greta gets deported first class, you get through → you unfurl the pride flag and the pañuelo verde → hiding in the only bathroom in the neighbourhood.
  - [ ] Cinematic: the boat, Greta's sign, the bathroom door.
- [ ] Endings for the "Continuará..." branches: concejal (political offer), fueros, Uruguay, quiet troll, independent.
- [ ] Next endings: one per first choice (tweet, Cristina), plus mixes.

## Stats

Hidden per-run values (`Stats` in `src/scenes/intro/types.ts`). Choices add `effects`; options with `when` are hidden unless they pass; nodes with `route` branch on them. Thresholds live at the top of `src/scenes/intro/script.ts`.

- anger: C6N, raging → unlocks «EN MAYÚSCULAS, 4 AM»
- communism: Palestine → ≥ 5 Greta's flotilla
- corruption: Russian money, the council seat → unused yet
- fame: tweeting, rejecting Russia → fame + money ≥ 7 caught; ≥ 7 political offer
- money: Russian money → ≥ 5 escape to Uruguay
- peronism: Cristina → ≥ 3 fueros escape; ≥ 7 San José vigil

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
| Greta Thunberg | Greta Thumbers | Gaza flotilla, "HOW DARE YOU!" |
| Russian handler | Vladimir Retuitov | pays 20 USD per post, "es mucho dinero, ¿da?" |
| INDEC | as is | the "publicó el dato" joke |
