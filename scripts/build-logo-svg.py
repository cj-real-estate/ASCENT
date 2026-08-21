#!/usr/bin/env python3
"""Build the distributable vector logo files in brand/.

The wordmark is emitted as OUTLINES, not <text>, so the files render
identically anywhere -- a print shop, Illustrator, a shirt vendor -- with no
font to install. Outlines come from the same Archivo 800 and IBM Plex Mono 500
woff2 files the site ships, so the vector logo and the website cannot drift.

The chevron geometry is read out of scripts/generate-assets.mjs for the same
reason: one source of truth for the mark.

Requires: pip install fonttools brotli
Run:      python3 scripts/build-logo-svg.py
"""
import pathlib
import re

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
BRAND = ROOT / "brand"
FONTS = ROOT / "src" / "fonts"

ORANGE, INK, WHITE = "#F05E23", "#1F1F1F", "#FFFFFF"

# --- mark geometry, parsed from the asset script so it can never drift -------
_assets = (ROOT / "scripts" / "generate-assets.mjs").read_text()


def _chevron(key: str) -> str:
    m = re.search(rf'{key}:\s*"([^"]+)"', _assets)
    if not m:
        raise SystemExit(f"could not find chevron '{key}' in generate-assets.mjs")
    return m.group(1)


MARK_OUTER, MARK_INNER = _chevron("outer"), _chevron("inner")
_vb = re.search(r"viewBox:\s*\{\s*w:\s*(\d+),\s*h:\s*(\d+)", _assets)
MARK_W, MARK_H = int(_vb.group(1)), int(_vb.group(2))

# --- lockup metrics, proportional to the mark -------------------------------
GAP = 70           # mark -> wordmark
WORD_CAP = 149     # ASCENT cap height
WORD_BASE = 204    # ASCENT baseline
TAG_CAP = 23       # tagline cap height
TAG_BASE = 257     # tagline baseline


def glyph_run(font_path, text):
    """Outlines for `text`, in font units, with cap height and advances."""
    font = TTFont(font_path)
    glyphs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    upem = font["head"].unitsPerEm
    cap = getattr(font["OS/2"], "sCapHeight", None) or int(upem * 0.7)
    run, x = [], 0
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            raise SystemExit(f"no glyph for {ch!r} in {font_path.name}")
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        run.append((pen.getCommands(), x))
        x += hmtx[name][0]
    return {"run": run, "width": x, "upem": upem, "cap": cap}


def text_group(spec, cap_target, baseline, x0, fill, tracking=0.0):
    """One <g> of outlined glyphs, scaled to cap_target and flipped y-down."""
    s = cap_target / spec["cap"]
    parts = []
    for i, (d, x) in enumerate(spec["run"]):
        if not d:            # space and other blank glyphs
            continue
        tx = x0 + x * s + tracking * i
        parts.append(
            f'<path transform="translate({tx:.2f} {baseline}) scale({s:.5f} {-s:.5f})" d="{d}"/>'
        )
    return f'<g fill="{fill}">' + "".join(parts) + "</g>", spec["width"] * s


def mark_svg(outer_fill, inner_fill):
    """The mark, with a transparent channel knocked out of the outer chevron
    wherever the inner one crosses it. Without it the all-white reverse merges
    into a single blob and the inner chevron disappears (brand guide 2). The
    gap is transparent rather than painted, so the files drop onto Ink,
    Graphite, a photo, or a garment without carrying a background with them."""
    return (
        f'<mask id="gap" maskUnits="userSpaceOnUse" x="0" y="0" '
        f'width="{MARK_W}" height="{MARK_H}">'
        f'<rect x="0" y="0" width="{MARK_W}" height="{MARK_H}" fill="#fff"/>'
        f'<path d="{MARK_INNER}" fill="#000" stroke="#000" stroke-width="19" '
        f'stroke-linejoin="round"/></mask>'
        f'<path fill="{outer_fill}" d="{MARK_OUTER}" mask="url(#gap)"/>'
        f'<path fill="{inner_fill}" d="{MARK_INNER}"/>'
    )


def svg_doc(width, height, body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height}" '
        f'width="{width:.0f}" height="{height}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{body}</svg>\n"
    )


def build():
    BRAND.mkdir(exist_ok=True)
    word = glyph_run(FONTS / "archivo-800.woff2", "ASCENT")
    tag = glyph_run(FONTS / "plex-mono-500.woff2", "CLIENT ACQUISITION SYSTEMS")

    word_x = MARK_W + GAP
    word_scale = WORD_CAP / word["cap"]
    word_w = word["width"] * word_scale

    # Letterspace the tagline so it measures exactly as wide as ASCENT --
    # the construction the delivered lockup uses.
    tag_scale = TAG_CAP / tag["cap"]
    natural = tag["width"] * tag_scale
    tracking = (word_w - natural) / (len(tag["run"]) - 1)

    total_w = word_x + word_w

    for name, outer, inner, wordc, tagc in [
        ("ascent-lockup.svg", ORANGE, INK, INK, ORANGE),
        ("ascent-lockup-white.svg", WHITE, WHITE, WHITE, WHITE),
    ]:
        g_word, _ = text_group(word, WORD_CAP, WORD_BASE, word_x, wordc)
        g_tag, _ = text_group(tag, TAG_CAP, TAG_BASE, word_x, tagc, tracking)
        body = mark_svg(outer, inner) + g_word + g_tag
        (BRAND / name).write_text(
            svg_doc(total_w, MARK_H, body, "Ascent Client Acquisition Systems")
        )
        print(f"wrote brand/{name}  {total_w:.0f}x{MARK_H}")

    for name, outer, inner in [
        ("ascent-mark.svg", ORANGE, INK),
        ("ascent-mark-white.svg", WHITE, WHITE),
    ]:
        (BRAND / name).write_text(
            svg_doc(MARK_W, MARK_H, mark_svg(outer, inner), "Ascent")
        )
        print(f"wrote brand/{name}  {MARK_W}x{MARK_H}")


if __name__ == "__main__":
    build()
