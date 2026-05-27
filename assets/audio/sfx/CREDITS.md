# SFX Credits

All sound effects in this folder are royalty-free / CC0 / public domain.
No attribution required, but listed below for traceability.

| File | Source | Page | License | Credit |
|---|---|---|---|---|
| `balloon-pop.ogg` | OpenGameArt | <https://opengameart.org/content/balloon-sounds> | CC0 | d.n.audio.uk / Gniffelbaf |
| `animal-cat.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/cat%20meow/> | Pixabay Content License | DRAGON-STUDIO |
| `animal-cow.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/cow%20moo/> | Pixabay Content License | DRAGON-STUDIO |
| `animal-dog.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/dog%20bark/> | Pixabay Content License | DRAGON-STUDIO |
| `animal-duck.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/duck%20quack/> | Pixabay Content License | iedurodrigues |
| `animal-elephant.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/elephant%20trumpet/> | Pixabay Content License | DRAGON-STUDIO |
| `animal-frog.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/frog%20croak/> | Pixabay Content License | DRAGON-STUDIO |
| `animal-lion.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/lion%20roar/> | Pixabay Content License | DRAGON-STUDIO |
| `animal-monkey.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/monkey/> | Pixabay Content License | u_zpj3vbdres |
| `animal-pig.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/pig%20oink/> | Pixabay Content License | freesound_community |
| `animal-sheep.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/sheep%20baa/> | Pixabay Content License | mrstokes302 |
| `vehicle-ambulance.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/ambulance%20siren/> | Pixabay Content License | scottishperson |
| `vehicle-bike.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/bicycle%20bell/> | Pixabay Content License | DRAGON-STUDIO |
| `vehicle-bus.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/bus%20horn/> | Pixabay Content License | universfield |
| `vehicle-car.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/car%20horn/> | Pixabay Content License | freesound_community |
| `vehicle-firetruck.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/fire%20truck%20siren/> | Pixabay Content License | freesound_community |
| `vehicle-helicopter.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/helicopter/> | Pixabay Content License | DRAGON-STUDIO |
| `vehicle-plane.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/airplane%20jet/> | Pixabay Content License | freesound_community |
| `vehicle-police.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/police%20siren/> | Pixabay Content License | DRAGON-STUDIO |
| `vehicle-rocket.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/rocket%20launch/> | Pixabay Content License | 49053354 |
| `vehicle-train.mp3` | Pixabay | <https://pixabay.com/sound-effects/search/train%20whistle/> | Pixabay Content License | amber2023 |

## License summary

- **OpenGameArt CC0** — Creative Commons Zero. Public domain dedication. No attribution required, free for commercial use.
- **Pixabay Content License** — Royalty-free. Free for commercial use. Attribution not required. <https://pixabay.com/service/license-summary/>

Both license tiers allow this kids' game to ship freely.

## How sounds are used in the game

- `balloon-pop.ogg` — played when balloon is tapped (mode: balloon).
- `animal-<type>.mp3` — played when animal sprite is tapped (mode: animal). Maps via `gameData.animal.items[].sound`.
- `vehicle-<type>.mp3` — played when vehicle sprite is tapped (mode: vehicle). Maps via `gameData.vehicle.items[].sound`.

Playback is gated by `SFX_CONFIG[name].max` so long source clips (some are 10–23 s) fade out to a 1–2 s game beep.

## Adding a new SFX

1. Drop the file into `assets/audio/sfx/`.
2. Add an entry to `SFX_CONFIG` in `index.html` with the file name, max duration, and gain.
3. Add the file path to `APP_ASSETS` in `service-worker.js` and bump the cache version.
4. Append a row to this `CREDITS.md` with the source URL + license.
