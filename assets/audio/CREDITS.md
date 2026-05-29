# Background Music Credits

Looping background-music tracks. SFX (animal calls, vehicles, balloon pop)
have their own credits in `sfx/CREDITS.md`.

| File | Used for | Source | License | Credit |
|---|---|---|---|---|
| `the-glade-at-dawn.mp3` | Home menu music | provided by project owner | — | — |
| `where-the-sunbeams-hide.mp3` | Gameplay music (all modes except ABC) | provided by project owner | — | — |
| `abc-song.mp3` | Gameplay music — **ABC / alphabet mode only** | Pixabay | Pixabay Content License | "ABC Song (Music Box)" — music_for_videos · <https://pixabay.com/music/lullabies-abc-song-music-box-156934/> |

## License note

The **Pixabay Content License** is royalty-free, free for commercial use, no
attribution required. <https://pixabay.com/service/license-summary/>

## How ABC music is wired

- `BG_MUSIC_ALPHABET` (`abc-song.mp3`) plays whenever `state.mode === 'alphabet'`,
  in both challenge and adventure play. Every other mode uses `BG_MUSIC_DEFAULT`
  (`where-the-sunbeams-hide.mp3`).
- `applyBgMusicForMode()` only swaps `bgMusic.src` when the desired track changes,
  so replaying the same mode doesn't restart the loop.
- It's an instrumental music-box rendition of the classic A-B-C melody, chosen so
  it doesn't fight the English letter pronunciation (TTS) on tap.
