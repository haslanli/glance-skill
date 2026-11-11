"""Build preview pages for the glance UI kit and, optionally, PNG screenshots.

    python3 tools/preview/build.py            # HTML pages in tools/preview/out/
    python3 tools/preview/build.py --png      # also PNGs via headless Chrome

The kit's CSS is read from references/ui-kit.md, so previews always match
what the skill uses. host.css stands in for the Claude app's theme colors.
"""
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = HERE / "out"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

HERO_CSS = """
.hero{display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:14px;line-height:1.5}
.pane{border:1px solid var(--border);border-radius:12px;padding:18px 20px;min-width:0;overflow:hidden;background:var(--surface-2)}
.tag{font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:10px;font-family:var(--font-mono)}
.md{color:var(--text-secondary);font-size:13px;max-height:600px;overflow:hidden;
  -webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent)}
.md h3{font-size:15px;color:var(--text-primary);margin:0 0 8px}.md h4{font-size:13px;color:var(--text-primary);margin:12px 0 4px}
.md p{margin:0 0 8px}.md ul,.md ol{margin:0;padding-left:18px}.md li{margin:2px 0}.md b{color:var(--text-primary);font-weight:500}
.md code,.bl code{font-family:var(--font-mono);font-size:12px}
.ans{margin:0 0 14px;font-size:14px}.ans code{font-family:var(--font-mono);font-size:13px}
.bl{margin-top:16px;font-size:13px}.bl b{font-weight:500}.bl ul,.bl ol{margin:4px 0 0;padding-left:18px}.bl li{margin:2px 0}
"""

PAGES = {
    # name: (body file, css width, extra css)
    "hero": ("hero.html", 980, HERO_CSS),
    "vps": ("demos/vps.html", 680, ""),
    "vps-narrow": ("demos/vps.html", 380, ""),
    "speed": ("demos/speed.html", 680, ""),
    "bill": ("demos/bill.html", 680, ""),
    "text-only": ("demos/text-only.html", 680, HERO_CSS),
}


def kit_css():
    doc = (ROOT / "references" / "ui-kit.md").read_text()
    return re.search(r"```html\n<style>\n(.*?)\n</style>\n```", doc, re.S).group(1)


def page(body, width, mode, extra):
    return (
        f'<!doctype html><html data-mode="{mode}"><head><meta charset="utf-8">'
        f'<link rel="stylesheet" href="../host.css"><style>{kit_css()}{extra}'
        "html,body{background:transparent}"
        f".frame{{width:{width}px;padding:24px;border-radius:14px;"
        "background:var(--surface-0);border:1px solid var(--border)}"
        f'</style></head><body><div class="frame">{body}</div></body></html>'
    )


def main():
    OUT.mkdir(exist_ok=True)
    built = []
    for name, (src, width, extra) in PAGES.items():
        body = (HERE / src).read_text()
        for mode in ("light", "dark"):
            f = OUT / f"{name}-{mode}.html"
            f.write_text(page(body, width, mode, extra))
            built.append((f, width))
    print(f"{len(built)} pages in {OUT}")
    if "--png" in sys.argv:
        heights = dict(a.split("=") for a in sys.argv if "=" in a)
        for f, width in built:
            h = int(heights.get(f.stem.rsplit("-", 1)[0], 900))
            png = ROOT / "docs" / "images" / f"{f.stem}.png"
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            "--force-device-scale-factor=2", "--default-background-color=00000000",
                            f"--window-size={width},{h}", f"--screenshot={png}", f.as_uri()],
                           check=True, capture_output=True)
            print("wrote", png.relative_to(ROOT))


if __name__ == "__main__":
    main()
