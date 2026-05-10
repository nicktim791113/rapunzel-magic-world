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

## TODO

- Future idea: add real recorded voice/audio assets if synthetic sounds are not warm enough for the target child.
