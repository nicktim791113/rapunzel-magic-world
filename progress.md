Original prompt: 優先改善這幾個地方也都要實作上去，並推上去。

## Progress

- Implemented a V2.1 pass in `index.html`: 30-second challenge loop, score/time/combo/level/missed HUD, pause/restart/mute/menu controls, master audio gain, cached noise buffer, combo/encouragement toasts, end summary screen, Rapunzel-themed tower/braid/lantern background, pointer events, corrected pop positioning, and `render_game_to_text`.
- Ran the develop-web-game Playwright client against `http://127.0.0.1:8080`; no console/page errors were reported.
- Ran a DOM-specific Playwright interaction check covering mode start, item hits, score/combo, mute, pause/resume, restart, timer summary, and return-to-menu.
- Reviewed mobile screenshots and tightened the mobile HUD so stats and control buttons do not stretch awkwardly.
- Implemented V2.2 difficulty settings: easy/normal/hard adjust duration, spawn cadence, fall speed, and level thresholds.
- Added procedural Web Audio background music with a separate music toggle plus existing global mute.
- Ran the develop-web-game Playwright client for V2.2; no console/page errors were reported.
- Ran a V2.2 DOM-specific Playwright check covering hard difficulty, menu/game music toggles, mute, pause/resume, restart preserving difficulty, and timer summary.
- Reviewed mobile menu/game/pause/summary screenshots.
- Implemented V2.3 feature set: toddler/child age modes, medals, localStorage profile/leaderboard, shop items, speech encouragement, per-mode missions, and mode-specific storybook backgrounds.
- Ran the develop-web-game Playwright client for V2.3; no console/page errors were reported.
- Ran V2.3 DOM-specific Playwright check covering shop purchases, auto-applied powerups, child/hard mode, mission completion, coins, medals, leaderboard, summary, and toddler mode.
- Reviewed mobile menu/game/summary/toddler screenshots.
- Implemented V2.4 layout/background pass: compressed the mobile home panel to fit the first viewport and added richer scene depth with sun, clouds, hills, fence, orchard trees, zoo prop, road, and sign.
- Ran mobile layout screenshots for menu/fruit/animal/vehicle and verified menu scrollHeight equals viewport height at 390x844.
- Ran the develop-web-game Playwright client for V2.4; no console/page errors were reported.
- Follow-up V2.4 responsive fix: made the home menu scroll-safe at all sizes, desktop uses four mode columns, tablet/mobile use compact panels, and verified mobile/tablet/desktop screenshots.
- Implemented V2.5 adventure entry: the home screen now starts a 10-level adventure path that advances by mission completion instead of the timed challenge clock, with mode/theme changes and progressively harder goals.
- Replaced procedural background music with the provided MP3 asset at `assets/audio/where-the-sunbeams-hide.mp3`, controlled by the existing music and mute buttons.
- Ran the develop-web-game Playwright client for V2.5 against the adventure start; no console/page errors were reported.
- Ran a V2.5 DOM-specific adventure flow check that completed all 10 levels, verified the summary screen, confirmed the MP3 source/loop/playback state, and reviewed mobile screenshots.
- Ran V2.5 responsive menu checks at mobile, tablet, and desktop sizes; the menu height matched each viewport without overflow.
- Generated a V2.6 4x4 falling-object sheet with the built-in image generation tool, removed the chroma-key background, split it into 16 clean transparent PNG assets under `assets/images/items/`, and removed small cross-cell artifacts.
- Updated dropped items to use the new image assets with CSS animations for balloons, fruit, animals, and vehicles.
- Ran the develop-web-game Playwright client for V2.6 and reviewed gameplay screenshots showing the new rendered falling objects.
- Ran V2.6 sprite asset checks across balloon, fruit, animal, and vehicle modes; all 16 PNG assets decoded successfully and each mode reported sprite-backed active items.
- Ran a V2.6 adventure flow check through all 10 levels; summary screen reached successfully with no console/page errors.
- Implemented V2.7 mission target display: HUD missions now render the target item image plus progress count, and toddler mode keeps the mission target visible.
- Improved vehicle item framing by using a wider falling-item box for vehicle mode so cars, rockets, and bicycles have more room on screen.
- Adjusted vehicle spawns to begin below the top HUD/control area so traffic items are not clipped by the viewport edge or controls when they first appear.
- Ran the develop-web-game Playwright client for V2.7 in vehicle mode and reviewed screenshots.
- Ran a V2.7 DOM check confirming mission targets use an image icon with only progress text, vehicle item boxes are wider than tall, vehicle items start below the HUD area, and the 10-level adventure still reaches summary.
- Implemented V2.8 home improvements: copied the provided `The_Glade_at_Dawn.mp3` into `assets/audio/the-glade-at-dawn.mp3`, added it as the homepage music track, and added a home screen difficulty/age-mode explanation dialog.
- Ran the develop-web-game Playwright client for V2.8 and reviewed desktop menu/guide screenshots; then ran a DOM-specific Playwright check covering guide open/close, music off/on, home-to-game music handoff, returning home, two-track audio inventory, and mobile menu/guide layout.

## TODO

- Future idea: add a second sprite sheet with per-object animation frames if true frame-by-frame GIF-style movement is needed.
- Future idea: add real recorded voice/audio assets if synthetic sounds are not warm enough for the target child.
