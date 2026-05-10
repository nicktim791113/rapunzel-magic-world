Original prompt: 優先改善這幾個地方也都要實作上去，並推上去。

## Progress

- Implemented a V2.1 pass in `index.html`: 30-second challenge loop, score/time/combo/level/missed HUD, pause/restart/mute/menu controls, master audio gain, cached noise buffer, combo/encouragement toasts, end summary screen, Rapunzel-themed tower/braid/lantern background, pointer events, corrected pop positioning, and `render_game_to_text`.
- Ran the develop-web-game Playwright client against `http://127.0.0.1:8080`; no console/page errors were reported.
- Ran a DOM-specific Playwright interaction check covering mode start, item hits, score/combo, mute, pause/resume, restart, timer summary, and return-to-menu.
- Reviewed mobile screenshots and tightened the mobile HUD so stats and control buttons do not stretch awkwardly.

## TODO

- No known loose ends after verification. Future idea: add real recorded voice/audio assets if synthetic sounds are not warm enough for the target child.
