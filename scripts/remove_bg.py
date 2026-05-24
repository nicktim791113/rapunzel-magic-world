"""Background remover for ChatGPT-generated PNG sprites.

ChatGPT GPT-4o image gen often outputs PNG files without a true alpha channel
even when the prompt asks for a transparent background — the "background" is
just a near-uniform colored fill (usually off-white). This script flood-fills
from every edge pixel and turns any connected region of similar color into
fully transparent pixels, leaving the central subject untouched.

Usage:
    python scripts/remove_bg.py <path-to-png> [<more>...]
    python scripts/remove_bg.py assets/images/items/*.png
"""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def remove_background(path: Path, tolerance: int = 32, soften: int = 8) -> None:
    """Convert a PNG to RGBA with the background made transparent.

    `tolerance`: max Manhattan distance in RGB to count as the same background colour.
    `soften`: extra distance allowed for partial transparency near the edge (anti-alias).
    """
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()

    # Reference: average of all four corners — robust to subtle gradients
    samples = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = tuple(sum(s[i] for s in samples) // 4 for i in range(3))

    visited = bytearray(w * h)  # 1 byte per pixel as a flat bool array
    q: deque[tuple[int, int]] = deque()

    # Seed every edge pixel — guarantees we don't accidentally start inside the subject
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    cleared = 0
    while q:
        x, y = q.popleft()
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        idx = y * w + x
        if visited[idx]:
            continue
        visited[idx] = 1
        r, g, b, _a = px[x, y]
        dist = color_distance((r, g, b), bg)
        if dist > tolerance + soften:
            continue
        if dist <= tolerance:
            px[x, y] = (r, g, b, 0)  # fully transparent
        else:
            # In the soft band: linear ramp to partial alpha for nicer edges
            frac = (dist - tolerance) / max(1, soften)
            alpha = int(round(255 * frac))
            px[x, y] = (r, g, b, alpha)
        cleared += 1
        q.append((x + 1, y))
        q.append((x - 1, y))
        q.append((x, y + 1))
        q.append((x, y - 1))

    im.save(path, optimize=True)
    pct = cleared * 100.0 / (w * h)
    print(f"{path.name}: bg={bg} cleared {cleared} pixels ({pct:.1f}%)")


def main(args: list[str]) -> int:
    if not args:
        print(__doc__)
        return 1
    paths = []
    for arg in args:
        p = Path(arg)
        if p.is_dir():
            paths.extend(p.glob("*.png"))
        elif "*" in str(p) or "?" in str(p):
            paths.extend(p.parent.glob(p.name))
        else:
            paths.append(p)
    if not paths:
        print("no matching PNG files")
        return 1
    for p in paths:
        try:
            remove_background(p)
        except Exception as e:
            print(f"{p}: ERROR {e}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
