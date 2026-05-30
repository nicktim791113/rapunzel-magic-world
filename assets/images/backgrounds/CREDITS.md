# Background Art Credits

Per-mode full-screen storybook backgrounds for 樂佩魔法 (Rapunzel Magic World).

| File | Mode | Scene |
|---|---|---|
| `bg-balloon.jpg`  | 氣球 balloon   | Dawn sky, floating lanterns, distant magic tower, flower hills |
| `bg-fruit.jpg`    | 水果 fruit     | Golden-hour magic orchard, glowing fruit trees, flower meadow |
| `bg-animal.jpg`   | 動物園 animal  | Enchanted forest glade, fence + lily pond, sunbeams |
| `bg-vehicle.jpg`  | 車車 vehicle   | Whimsical town: cobblestone road (lower third) + open sky |
| `bg-alphabet.jpg` | ABC alphabet  | Dusk starry night-garden, lanterns, open books + quill |

## Source / License

- Generated with **ChatGPT (GPT-4o image generation)**, OpenAI. The account
  owner holds the rights to the generated output under OpenAI's terms; free to
  use in this project.
- **Original fairy-tale scenery only** — no Disney / "Tangled" trade dress,
  no character likenesses, no people. The "long-haired-princess tower + floating
  lanterns" are public-domain Brothers-Grimm *Rapunzel* motifs rendered in an
  original whimsical storybook style.
- Vertical 1024×1536 (2:3) source, exported to optimized progressive JPEG
  (q82) — ~1 MB total for all five.

## How they're used

- Applied via `#game-container.theme-<mode>` `background: url(...) center/cover`.
- Each illustration keeps its own tower/lanterns/scenery, so during gameplay the
  old CSS scenery (`.tower-roof`, `.lantern`, `.scene-*`, the `::before/::after`
  tower) is hidden. The home menu (no theme class) still shows the CSS scene.
- Prompts kept the CENTER calm/uncluttered so falling/rising game sprites stay
  readable; detail lives at the edges + bottom.

## Regenerating

Re-run the same prompts in ChatGPT, download, then:
`python -c "from PIL import Image; Image.open('bg-X.png').convert('RGB').save('bg-X.jpg','JPEG',quality=82,optimize=True,progressive=True)"`
and bump the service-worker cache version.
