"""Split a ChatGPT-generated fruit composite into 3 sprite files.

The composite layout is:
    +-----------------------------+
    |                             |
    |       WHOLE FRUIT           |   <- TOP half
    |                             |
    +-----------------------------+
    |              |              |
    |  LEFT HALF   |  RIGHT HALF  |   <- BOTTOM half
    |              |              |
    +-----------------------------+

Rather than splitting at fixed 50/50 cuts (the actual subjects rarely line up
perfectly with the geometric midline), this script detects each subject by
its alpha channel and writes out a tightly-cropped PNG per subject.

Usage:
    python scripts/split_fruit_composite.py path/to/fruit-NAME-composite.png

Produces (in the same directory):
    fruit-NAME.png            <- whole fruit (top)
    fruit-NAME-half-left.png  <- left half (bottom-left)
    fruit-NAME-half-right.png <- right half (bottom-right)

If the source filename does not end in -composite.png, the suffix is stripped
to derive the base name.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image


ALPHA_THRESHOLD = 30  # pixels with alpha <= this count as background
NOISE_ALPHA_THRESHOLD = 60  # pre-cleanup: pixels with alpha < this are wiped to fully transparent
EMPTY_RATIO = 0.02    # a line is "empty" if fewer than this fraction of its pixels has content


def clean_alpha_noise(im: Image.Image) -> Image.Image:
    """Wipe weak alpha pixels so anti-alias halos from remove_bg don't fool bbox detection."""
    r, g, b, a = im.split()
    cleaned = a.point(lambda v: 0 if v < NOISE_ALPHA_THRESHOLD else v)
    return Image.merge("RGBA", (r, g, b, cleaned))


def row_content_count(im: Image.Image, y: int) -> int:
    """Count non-transparent pixels on row y."""
    a = im.split()[-1]
    row = a.crop((0, y, im.width, y + 1)).tobytes()
    return sum(1 for v in row if v > ALPHA_THRESHOLD)


def column_content_counts(im: Image.Image, y0: int, y1: int) -> list[int]:
    """Count non-transparent pixels per column in y0..y1."""
    a = im.split()[-1]
    px = a.load()
    return [sum(1 for y in range(y0, y1) if px[x, y] > ALPHA_THRESHOLD) for x in range(im.width)]


def find_horizontal_split(im: Image.Image) -> int:
    """Find the y coordinate of the empty gap between top and bottom zones.

    A "gap" must be sustained — at least MIN_GAP_RATIO of the image height worth
    of consecutive low-content rows. That stops thin one-row dips inside a single
    subject (e.g. between a pineapple's leaf crown and its body) from being
    mistaken for the real gap between WHOLE and HALVES.

    Falls back to 50% of the image height when no usable gap is found or the gap
    lies in the bottom 30% of the image.
    """
    w, h = im.size
    row_threshold = max(1, int(w * EMPTY_RATIO))
    min_gap_rows = max(8, int(h * 0.03))
    counts = [row_content_count(im, y) for y in range(h)]

    # Find first row with real content (top subject starts)
    try:
        top_start = next(y for y in range(h) if counts[y] > row_threshold)
    except StopIteration:
        return h // 2

    # Scan past top_start, looking for a SUSTAINED empty zone of min_gap_rows
    gap_start = -1
    gap_end = -1
    y = top_start + 1
    while y < h - min_gap_rows:
        if counts[y] > row_threshold:
            y += 1
            continue
        # Found a low-content row — check if next min_gap_rows rows are also low
        if all(counts[y + k] <= row_threshold for k in range(min_gap_rows)):
            gap_start = y
            # Extend gap_end while rows stay empty
            gap_end = y
            while gap_end < h and counts[gap_end] <= row_threshold:
                gap_end += 1
            break
        y += 1

    if gap_start < 0 or gap_end < 0 or gap_start > h * 0.7:
        return h // 2

    return (gap_start + gap_end) // 2


def find_vertical_split(im: Image.Image, y0: int, y1: int) -> int:
    """Find the x coordinate of the gap between left and right halves in y0..y1.

    Same sustained-gap logic as find_horizontal_split — guards against single
    column dips inside a subject being mistaken for the real gap.
    Falls back to 50% width otherwise.
    """
    w = im.width
    counts = column_content_counts(im, y0, y1)
    col_threshold = max(1, int((y1 - y0) * EMPTY_RATIO))
    min_gap_cols = max(8, int(w * 0.03))

    try:
        left_start = next(x for x in range(w) if counts[x] > col_threshold)
    except StopIteration:
        return w // 2

    gap_start = -1
    gap_end = -1
    x = left_start + 1
    while x < w - min_gap_cols:
        if counts[x] > col_threshold:
            x += 1
            continue
        if all(counts[x + k] <= col_threshold for k in range(min_gap_cols)):
            gap_start = x
            gap_end = x
            while gap_end < w and counts[gap_end] <= col_threshold:
                gap_end += 1
            break
        x += 1

    if gap_start < 0 or gap_end < 0:
        return w // 2

    return (gap_start + gap_end) // 2


def tight_crop(im: Image.Image, padding: int = 16) -> Image.Image:
    """Crop to the rows/columns that actually contain the subject.

    Unlike Image.getbbox() (which trusts any non-zero alpha pixel), this routine
    only counts pixels above ALPHA_THRESHOLD and requires each surviving row/col
    to carry at least EMPTY_RATIO worth of those pixels — so faint anti-alias
    halo around the cleaned background can't keep dragging the bbox outward.
    """
    arr = np.array(im)
    if arr.shape[2] < 4:
        return im
    alpha = arr[..., 3]
    h, w = alpha.shape
    mask = alpha > ALPHA_THRESHOLD
    row_th = max(1, int(w * EMPTY_RATIO))
    col_th = max(1, int(h * EMPTY_RATIO))
    row_sig = mask.sum(axis=1) > row_th
    col_sig = mask.sum(axis=0) > col_th
    if not row_sig.any() or not col_sig.any():
        return im
    top = int(np.argmax(row_sig))
    bottom = h - 1 - int(np.argmax(row_sig[::-1]))
    left = int(np.argmax(col_sig))
    right = w - 1 - int(np.argmax(col_sig[::-1]))
    return im.crop((
        max(0, left - padding),
        max(0, top - padding),
        min(w, right + padding + 1),
        min(h, bottom + padding + 1),
    ))


def main(args: list[str]) -> int:
    if not args:
        print(__doc__)
        return 1
    for arg in args:
        path = Path(arg)
        if not path.exists():
            print(f"{path}: not found")
            continue
        im = Image.open(path).convert("RGBA")
        im = clean_alpha_noise(im)  # strip the anti-alias halo first

        # Derive base name (strip -composite suffix if present)
        stem = path.stem.removesuffix("-composite")
        out_dir = path.parent

        # Split horizontally to separate whole fruit from halves
        split_y = find_horizontal_split(im)
        whole_box = im.crop((0, 0, im.width, split_y))
        bottom_box = im.crop((0, split_y, im.width, im.height))

        # Within bottom, split vertically to separate left/right halves
        split_x_in_bottom = find_vertical_split(bottom_box, 0, bottom_box.height)
        left_box = bottom_box.crop((0, 0, split_x_in_bottom, bottom_box.height))
        right_box = bottom_box.crop((split_x_in_bottom, 0, bottom_box.width, bottom_box.height))

        # Tight-crop each to its content
        whole_box = tight_crop(whole_box)
        left_box = tight_crop(left_box)
        right_box = tight_crop(right_box)

        whole_path = out_dir / f"{stem}.png"
        left_path = out_dir / f"{stem}-half-left.png"
        right_path = out_dir / f"{stem}-half-right.png"

        whole_box.save(whole_path, optimize=True)
        left_box.save(left_path, optimize=True)
        right_box.save(right_path, optimize=True)

        print(
            f"{path.name} -> {whole_path.name} ({whole_box.size}) + "
            f"{left_path.name} ({left_box.size}) + {right_path.name} ({right_box.size})"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
