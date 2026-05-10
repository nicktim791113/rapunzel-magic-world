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

## TODO

- Future idea: add real recorded voice/audio assets if synthetic sounds are not warm enough for the target child.
