# Ideas

## Objects

Entries in `src/progress/unlockables.ts`, drawings and places in `src/scenes/story/objects.ts`. Locked ones show as a dark silhouette; an unlock shows up on the next run, and the toast says so.

- **Shelf under the TV:** empty bottom nooks for more objects
- **Mate:** [ ] Mate, unlocked by nationalism ≥ 3 → then stickers: [ ] Maradona · [ ] Abuelas de Plaza de Marzo · [ ] Malvinas. Stickers require the mate: `condition: ({ unlocked }) => unlocked.includes("mate")`.

## Endings

Rule: **you always die on the toilet**, sitting and scrolling the news (always some right-wing win somewhere). Every ending is the same death; what changes is how you got there. Entries in `src/progress/endings.ts`, reached from story nodes in `src/scenes/story/script.ts`.

- **Troll del Kremlin:**
  - [ ] Follower counter that grows on screen while posting.
  - [ ] Phone / Y app scene for the posting part.
- [ ] Next endings: one per first choice (tweet, Cristina), plus mixes.

## Places

`PlaceId` in `src/scenes/story/places.ts`; story lines set `place` and it sticks, like `expression`.

- [ ] Concejo for the councillor branch

## Sounds

Generated with a Python stdlib script (no packages). Ids in `SFX` (`src/audio.ts`); story lines play one with `sfx`. Toasts play `unlock` for objects and `ending` for endings.

## Stats

Hidden per-run values (`Stats` in `src/stats.ts`). Choices add `effects`; options with `when` are hidden unless they pass; nodes with `route` branch on them. Thresholds live at the top of `src/scenes/story/script.ts` and `src/progress/unlockables.ts`.

- anger: C6N, raging → unlocks «EN MAYÚSCULAS, 4 AM»
- communism: Palestine, kufiya, marching → ≥ 2 El Capital
- corruption: Russian money, the council seat → unused yet
- fame: tweeting, rejecting Russia → fame + money ≥ 7 caught; ≥ 7 political offer
- lgbt: furros on Y, pronouns in the bio, Goro's meetup and the Pride after, «Marchar por todo», boarding the flotilla → ≥ 3 Bandera del orgullo
- money: Russian money → ≥ 5 escape to Uruguay
- [ ] nationalism (new stat, not in `Stats` yet): being against Halloween (TN: «Halloween ya supera al Día de la Tradición», you rage-tweet about it), tweeting about Maradona (mock name TBD) → ≥ 3 Mate
- palestine: Palestine, kufiya, marching → ≥ 3 Bandera de Palestina; ≥ 5 Greta's flotilla
- peronism: Cristina → ≥ 3 fueros escape; ≥ 5 manos de Perón; ≥ 7 San José vigil

## Player faces

`Expression` in `src/scenes/story/types.ts`; story lines set `expression` and it sticks until changed.

- [ ] relieved (C6N calming him down)

## Mileón art

Pixel art, ultra chad: sideburns (patillas), square jaw and chin, giant smile.

- [ ] **Gigachad portrait:** the meme's black-and-white chiseled profile, but Mileón. For the TV, the news, the intro.
- [ ] **Riding a lion like a horse:** for some other flow (a rally, the inauguration, the ending of a Mileísta branch). Lion rearing up, Mileón with the chainsaw raised.

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
| Esteban Paulón | Estebxn Paulxn | inclusive-language x |
| Greta Thunberg | Greta Thunbarco | Thunberg + barco; Gaza flotilla, "HOW DARE YOU!" |
| Russian handler | Vladimir Putazo | pays 20 USD per post, "es mucho dinero, ¿da?" |
| INDEC | as is | the "publicó el dato" joke |
