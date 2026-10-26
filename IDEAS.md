# Ideas

## Objects

Entries in `src/progress/unlockables.ts`: an event (`on`) plus a `condition`.

- **Wall:** [x] Póster «Vamos a volver» (first run) · [x] Bandera de Palestina (palestine ≥ 3) · [ ] Bandera LGBT
- **Bathroom:** [x] Consolador arcoíris (lgbt ≥ 3), on a shelf in the home bathroom

Each object has a drawing and a place in `src/scenes/intro/objects.ts`: locked ones show as a dark silhouette, and an unlock mid-run swaps it in on the spot.
- **Furniture (biblioteca):** [ ] Libro de Marx · [ ] Estatua de las manos de Perón. Not unlockable itself: appears with whichever of its objects unlocks first (objects declare `furniture: "shelf"`).
- **Mate:** [ ] Mate → then stickers: [ ] Maradona · [ ] Abuelas de Plaza de Marzo. Stickers require the mate: `condition: ({ unlocked }) => unlocked.includes("mate")`.
- **Body:** [ ] Tatuaje de Malvinas

## Endings

Rule: **you always die on the toilet**, sitting and scrolling the news (always some right-wing win somewhere). Every ending is the same death; what changes is how you got there. Entries in `src/progress/endings.ts`, reached from story nodes in `src/scenes/intro/script.ts`.

- [x] **Every ending gets a pixel-art cinematic** (same style as the room and the player): a few animated frames of the death before the "FINAL DESBLOQUEADO" toast. Could be a scene that takes an ending id and plays its frames.

- [x] **Troll del Kremlin:** C6N spins good news as bad → you rage-post on Y → you go viral → Russia pays you to post → TN exposes the troll network → a Siberian hitman gets you on the toilet.
  - [ ] Follower counter that grows on screen while posting.
  - [ ] Phone / Y app scene for the posting part.
  - [x] Make the "Rechazar Rusia" choice matter: Russia asks three times (20 USD, 200 USD, Sochi); caught only if fame + money ≥ 7, with escapes (fueros, Uruguay).
  - [x] Cinematic (`death-home`): sitting sideways scrolling right-wing news, the hitman walks in, aims, bang, blackout.
- [x] **Vigilia en San José 1111:** a flow where you go camp outside Cristina's house arrest, waiting for her to come out on the balcony. Days of vigil, no bathroom but the chemical ones: she finally waves, the crowd jumps, and the chemical toilet you're in tips over.
  - [x] Cinematic (`death-chemical`): cut-away chemical toilet, the crowd jumps, the screen shakes, it tips over.
- [x] **Flotilla de la Libertad:** tweeting for Palestine + kufiya (communism ≥ 5) → Greta Thunbarco invites you to the Gaza flotilla → Greta gets deported first class, you get through → you unfurl the pride flag and the pañuelo verde → hiding in the only bathroom in the neighbourhood.
  - [x] Cinematic (`death-gaza`): same sitting shot in a sick brown bathroom, armed silhouettes walk in, burst, blackout.
- [ ] Endings for the "Continuará..." branches: concejal (political offer), fueros, Uruguay, quiet troll, independent.
- [ ] Next endings: one per first choice (tweet, Cristina), plus mixes.

## Places

`PlaceId` in `src/scenes/intro/places.ts`; story lines set `place` and it sticks, like `expression`. The room is built up front, the rest on first visit.

- [x] room (default) · boat (with Greta) · gaza · bathroom (home, with its objects) · gaza-bathroom · san-jose (balcony, crowd, chemical toilets) · colonia (Uruguay escape)
- [ ] Concejo for the councillor branch

## Sounds

Generated with a Python stdlib script (no packages). Ids in `SFX` (`src/audio.ts`); story lines play one with `sfx`.

- burst (rifles) · click (buttons) · coins (Russian money) · crash (chemical toilet) · crowd (San José) · gunshot (the hitman) · knock (the door) · notify (Y posts, Vladimir's DMs) · static (channel change) · unlock (toasts) · waves (boat, Buquebus)

## Stats

Hidden per-run values (`Stats` in `src/scenes/intro/types.ts`). Choices add `effects`; options with `when` are hidden unless they pass; nodes with `route` branch on them. Thresholds live at the top of `src/scenes/intro/script.ts`.

- anger: C6N, raging → unlocks «EN MAYÚSCULAS, 4 AM»
- communism: Palestine → unused yet (Libro de Marx?)
- lgbt: «Marchar por todo», boarding the flotilla → ≥ 3 Consolador arcoíris
- corruption: Russian money, the council seat → unused yet
- fame: tweeting, rejecting Russia → fame + money ≥ 7 caught; ≥ 7 political offer
- money: Russian money → ≥ 5 escape to Uruguay
- palestine: Palestine, kufiya, marching → ≥ 3 Bandera de Palestina; ≥ 5 Greta's flotilla
- peronism: Cristina → ≥ 3 fueros escape; ≥ 7 San José vigil

## Player faces

`Expression` in `src/scenes/intro/types.ts`; story lines set `expression` and it sticks until changed. Angry and furious shake.

- [x] angry · dead · furious · greedy · happy · sad · shocked · smug
- [ ] relieved (C6N calming him down)

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
| Greta Thunberg | Greta Thunbarco | Thunberg + barco; Gaza flotilla, "HOW DARE YOU!" |
| Russian handler | Vladimir Retuitov | pays 20 USD per post, "es mucho dinero, ¿da?" |
| INDEC | as is | the "publicó el dato" joke |
