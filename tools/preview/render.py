"""Render a glance widget to PNGs, the way the Claude app shows it.

    python3 tools/preview/render.py widget.html out/name            # light and dark at 680 px, light at 380 px
    python3 tools/preview/render.py demo.html out/name --kit        # prepend the kit's CSS (for demo bodies without it)

Writes out/name-<mode>-<width>.png, cropped to the content. host.css stands in
for the app's theme colors; Chart.js loads from the CDN, so this needs a network.
"""
import pathlib
import re
import subprocess
import sys
import tempfile

from PIL import Image, ImageChops

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SIZES = [("light", 680), ("dark", 680), ("light", 380)]
SCALE = 2


def kit_css():
    doc = (ROOT / "references" / "ui-kit.md").read_text()
    return re.search(r"```html\n(<style>\n.*?\n</style>)\n```", doc, re.S).group(1)


def page(body, width, mode):
    host = (HERE / "host.css").as_uri()
    return (
        f'<!doctype html><html data-mode="{mode}"><head><meta charset="utf-8">'
        f'<link rel="stylesheet" href="{host}"><style>html,body{{margin:0;background:var(--surface-0)}}'
        f".wf{{width:{width}px;padding:24px}}</style></head>"
        f'<body><div class="wf">{body}</div></body></html>'
    )


def crop(png):
    im = Image.open(png).convert("RGB")
    bg = Image.new("RGB", im.size, im.getpixel((2, 2)))
    box = ImageChops.difference(im, bg).getbbox()
    if box:
        pad = 16 * SCALE
        l, t, r, b = box
        im = im.crop((0, max(0, t - pad), im.width, min(im.height, b + pad)))
    im.save(png)


def main():
    src, prefix = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    body = src.read_text()
    if "--kit" in sys.argv:
        body = kit_css() + body
    prefix.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for mode, width in SIZES:
            html = pathlib.Path(tmp) / f"{mode}-{width}.html"
            html.write_text(page(body, width, mode))
            png = prefix.parent / f"{prefix.name}-{mode}-{width}.png"
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            f"--force-device-scale-factor={SCALE}", "--virtual-time-budget=6000",
                            f"--window-size={width + 48},1600", f"--screenshot={png}", html.as_uri()],
                           check=True, capture_output=True, timeout=90)
            crop(png)
            print("wrote", png)


if __name__ == "__main__":
    main()
