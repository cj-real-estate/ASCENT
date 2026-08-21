#!/usr/bin/env python3
"""Derive exact vector geometry for the Ascent mark from the delivered raster.

The delivered brand assets are raster only -- even the Canva .svg export wraps a
308x297 PNG in a luminance mask rather than carrying real paths. This script
recovers true vector geometry from `brand/source/ascent-mark-original.png`:

  1. classify pixels into the orange and ink chevrons,
  2. trace each region's boundary,
  3. least-squares fit a line to every straight edge,
  4. intersect consecutive lines for the ideal (unrounded) corners,
  5. fit a circle at each rounded corner to recover its fillet radius,
  6. emit a path of lines and exact circular arcs.

The transparent channel between the two chevrons is part of the traced outline,
so the output needs no mask: two plain filled paths reproduce the artwork, and
the reverse (all-white) lockup keeps both chevrons legible for free.

Requires: pip install numpy pillow
Run:      python3 scripts/trace-mark.py
"""
import json
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "brand" / "source" / "ascent-mark-original.png"
OUT = ROOT / "brand" / "mark-paths.json"

ROUND_MIN = 2.0     # corners with more clearance than this get a fillet
EDGE_MIN = 25.0     # px; shorter boundary runs are corner rounding, not edges


def load():
    im = np.array(Image.open(SRC).convert("RGBA")).astype(int)
    a, r, g, b = im[..., 3], im[..., 0], im[..., 1], im[..., 2]
    solid = a > 128
    return (solid & (r > 150) & (b < 110),
            solid & (r < 110) & (g < 110) & (b < 110))


def boundary(mask):
    m = np.pad(mask, 1)
    ys, xs = np.nonzero(m)
    start = (ys.min(), xs[ys == ys.min()].min())
    nb = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]
    out, cur, bd = [], start, 6
    while True:
        out.append((cur[1] - 1, cur[0] - 1))
        for k in range(8):
            d = (bd + 1 + k) % 8
            ny, nx = cur[0] + nb[d][0], cur[1] + nb[d][1]
            if m[ny, nx]:
                bd = (d + 5) % 8
                cur = (ny, nx)
                break
        else:
            break
        if cur == start and len(out) > 2:
            break
    return np.array(out, float)


def simplify(pts, eps):
    def rec(p):
        if len(p) < 3:
            return p
        a, b = p[0], p[-1]
        ab = b - a
        L = np.hypot(*ab)
        d = (np.abs(np.cross(ab, p - a)) / L) if L else np.hypot(*(p - a).T)
        i = int(np.argmax(d))
        return rec(p[:i + 1])[:-1] + rec(p[i:]) if d[i] > eps else [a, b]
    ring = np.vstack([pts, pts[:1]])
    return np.array(rec(ring)[:-1])


def fit_lines(pts):
    poly = simplify(pts, 1.2)
    n = len(poly)
    fits = []
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        d = b - a
        L = np.hypot(*d)
        if L <= EDGE_MIN:
            continue
        u = d / L
        nv = np.array([-u[1], u[0]])
        rel = pts - a
        t, dist = rel @ u, np.abs(rel @ nv)
        sel = pts[(t > L * .12) & (t < L * .88) & (dist < 2.5)]
        c = sel.mean(axis=0)
        _, _, vv = np.linalg.svd(sel - c)
        fits.append((c, vv[0]))
    return fits


def corner(l1, l2):
    (c1, d1), (c2, d2) = l1, l2
    A = np.array([d1, -d2]).T
    t = np.linalg.solve(A, c2 - c1)
    return c1 + t[0] * d1


def fit_radius(pts, P, r_guess):
    """Circle fit over the contour points forming this corner's fillet."""
    near = pts[np.hypot(*(pts - P).T) < r_guess * 3.2 + 6]
    if len(near) < 6:
        return 0.0
    A = np.c_[2 * near, np.ones(len(near))]
    sol, *_ = np.linalg.lstsq(A, (near ** 2).sum(1), rcond=None)
    return float(np.sqrt(max(sol[2] + sol[0] ** 2 + sol[1] ** 2, 0)))


def build(mask, name):
    pts = boundary(mask)
    lines = fit_lines(pts)
    out = []
    for k in range(len(lines)):
        P = corner(lines[k], lines[(k + 1) % len(lines)])
        clear = float(np.min(np.hypot(*(pts - P).T)))
        r = fit_radius(pts, P, clear) if clear > ROUND_MIN else 0.0
        # keep the fillet inside the two edges it joins
        if r and r > clear * 6:
            r = clear * 6
        out.append({"p": P.tolist(), "clear": clear, "r": round(r, 2)})
    print(f"{name}: {len(out)} corners  " +
          "  ".join(f"({c['p'][0]:.1f},{c['p'][1]:.1f})r{c['r']:.1f}" for c in out))
    return out


def fillet_path(corners, ox, oy):
    """Lines plus exact circular arcs, offset so the mark starts at 0,0."""
    P = [np.array(c["p"]) - [ox, oy] for c in corners]
    R = [c["r"] for c in corners]
    n = len(P)
    segs = []
    for i in range(n):
        A, C, B = P[(i - 1) % n], P[i], P[(i + 1) % n]
        u1 = (A - C) / np.hypot(*(A - C))
        u2 = (B - C) / np.hypot(*(B - C))
        if R[i] <= 0:
            segs.append(("L", C, None, None))
            continue
        th = np.arccos(np.clip(u1 @ u2, -1, 1))
        d = min(R[i] / np.tan(th / 2),
                .45 * np.hypot(*(A - C)), .45 * np.hypot(*(B - C)))
        sweep = 1 if float(u1[0] * u2[1] - u1[1] * u2[0]) < 0 else 0
        segs.append(("A", C + d * u1, C + d * u2, (d * np.tan(th / 2), sweep)))

    parts = [f"M{segs[0][1][0]:.2f},{segs[0][1][1]:.2f}"]
    if segs[0][0] == "A":
        t2, (rr, sw) = segs[0][2], segs[0][3]
        parts.append(f"A{rr:.2f},{rr:.2f} 0 0 {sw} {t2[0]:.2f},{t2[1]:.2f}")
    for kind, a, b, extra in segs[1:]:
        parts.append(f"L{a[0]:.2f},{a[1]:.2f}")
        if kind == "A":
            rr, sw = extra
            parts.append(f"A{rr:.2f},{rr:.2f} 0 0 {sw} {b[0]:.2f},{b[1]:.2f}")
    parts.append("Z")
    return " ".join(parts)


def main():
    orange, ink = load()
    o_corners = build(orange, "orange")
    i_corners = build(ink, "ink")
    ys, xs = np.nonzero(orange | ink)
    x0, y0, x1, y1 = float(xs.min()), float(ys.min()), float(xs.max()), float(ys.max())
    out = {
        "_comment": "GENERATED by scripts/trace-mark.py from the delivered "
                    "raster mark. Do not hand-edit. The transparent channel "
                    "between the chevrons is part of the outline, so these "
                    "two paths need no mask.",
        "width": round(x1 - x0, 2),
        "height": round(y1 - y0, 2),
        "outer": fillet_path(o_corners, x0, y0),
        "inner": fillet_path(i_corners, x0, y0),
    }
    OUT.write_text(json.dumps(out, indent=2) + "\n")
    print(f"{out['width']}x{out['height']} -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
