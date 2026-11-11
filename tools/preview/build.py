"""Build the README images in light and dark: the hero, the gallery rows and the color figure.

    python3 tools/preview/build.py              # HTML pages in tools/preview/out/
    python3 tools/preview/build.py --png        # also PNGs in docs/images/ via headless Chrome
    python3 tools/preview/build.py --png hero   # only the pages whose name starts with "hero"

The kit's CSS is read from references/ui-kit.md, so every image is built from what
the skill draws. host.css stands in for the Claude app's theme colors. Chart.js
loads from the CDN, so --png needs a network.
"""
import pathlib
import re
import subprocess
import sys

from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = HERE / "out"
IMG = ROOT / "docs" / "images"
DEMOS = HERE / "demos"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
MODES = ("light", "dark")


def kit_css():
    doc = (ROOT / "references" / "ui-kit.md").read_text()
    return re.search(r"```html\n<style>\n(.*?)\n</style>\n```", doc, re.S).group(1)


def scoped_tokens():
    """The host's light and dark tokens as .t-light / .t-dark, so one image can mix both."""
    host = (HERE / "host.css").read_text()
    light = re.search(r":root\{(.*?)\}", host).group(1)
    dark = re.search(r":root\[data-mode=dark\]\{(.*?)\}", host).group(1)
    return f".t-light{{{light}}}.t-dark{{{light};{dark}}}"


def demo(name):
    return (DEMOS / f"{name}.html").read_text()


# ---------------------------------------------------------------- gallery

GALLERY_CSS = """
.row{display:flex;gap:16px;width:1040px;align-items:stretch}
.tile{flex:1 1 0;min-width:0;border-radius:22px;padding:30px 30px 34px;background:var(--tile);display:flex;flex-direction:column}
:root{--tile:#F0EEE7}:root[data-mode=dark]{--tile:#232221}
.tile.wide{display:grid;grid-template-columns:250px minmax(0,1fr);column-gap:44px;align-items:start}
.tile h3{font-size:20px;font-weight:500;letter-spacing:-.015em;line-height:1.25;margin:0;color:var(--text-primary)}
.tile .who{font-size:14px;line-height:1.4;color:var(--text-secondary);margin:6px 0 0}
.tile .ans{font-size:15px;line-height:1.55;margin:22px 0 20px;color:var(--text-primary)}
.tile.wide .ans{margin:20px 0 0}
.tile code,.bl code{font-family:var(--font-mono);font-size:13px}
.bl{font-size:14px;line-height:1.5;color:var(--text-primary);margin-top:16px}
.bl b{font-weight:500}.bl ul,.bl ol{margin:4px 0 0;padding-left:20px}.bl li{margin:3px 0}
.end{font-size:13px;color:var(--text-muted);margin-top:auto;padding-top:22px;font-family:var(--font-mono)}
"""

TEXT_ONLY = """
<div class="bl"><b>Why it happens</b><ul>
<li>The session cookie has no <code>Domain</code> attribute (<code>auth/session.ts:41</code>)</li>
<li>The payment dashboard returns people to <code>www.shop.example.com</code></li>
<li><code>www.</code> is served by the same app with no redirect, so the page loads without the cookie</li>
<li>Apple Pay isn't affected: it returns on the same page</li></ul></div>
<div class="bl"><b>Fix</b><ol>
<li>Change the return URL to <code>https://shop.example.com/checkout/done</code></li>
<li>Optional: set <code>Domain=shop.example.com</code> and redirect <code>www.</code></li></ol></div>
<div class="bl"><b>Still to confirm</b><ul>
<li>The return URL comes from your screenshot, not the dashboard</li>
<li>Older mobile app versions may use the same return URL</li></ul></div>
<div class="end">glance mode off</div>
"""

GALLERY = {
    "gallery-ops": [
        dict(title="Memory against limits", who="Ops · a Kubernetes memory report",
             ans="<code>report-worker</code> is already over its memory limit and was killed 14 times in a day. <code>api</code> and <code>search</code> are close.",
             body=demo("memory")),
        dict(title="What a bundle is made of", who="Frontend · a bundle analysis",
             ans="Nearly half of the dashboard's main file is the chart library, and every page downloads it.",
             body=demo("bundle")),
    ],
    "gallery-growth": [
        dict(wide=True, title="A dip in a month of data", who="Growth · daily signups",
             ans="Signups fell to about half on 12–15 March because the verification email stopped going out. They bounced back right after, and March still ended 4 % up.",
             body=demo("signups")),
    ],
    "gallery-eng": [
        dict(title="What an upgrade changed", who="Backend · p95 latency per endpoint",
             ans="The new database driver sped up four of seven endpoints and slowed three; <code>/search</code> now misses its 300 ms target.",
             body=demo("latency")),
        dict(title="Where a test run broke", who="CI · one release branch",
             ans="Only Windows is really broken: the file-watcher tests fail there on Node 20 and 22. Linux and macOS can ship.",
             body=demo("ci")),
    ],
    "gallery-choice": [
        dict(wide=True, title="Choosing between options", who="Buying · four servers, one budget",
             ans="Get the Kestrel KS-8: it's the only option under your $40 budget with enough memory for Postgres plus two transcodes, and its traffic has no cap.",
             body=demo("vps")),
    ],
    "gallery-money": [
        dict(title="Why a bill jumped", who="Cloud costs · an AWS bill",
             ans="Your AWS bill more than doubled in October, almost all because of two changes in its first week.",
             body=re.sub(r'<div class="gl-sec gl-tiles">.*?</div>\n</div>\n', '', demo("bill"), count=1, flags=re.S)),
        dict(title="And when there's nothing to chart", who="Debugging · a logout bug",
             ans="People get logged out after paying by card because the payment page sends them back to <code>www.shop.example.com</code>, and the login cookie only works on <code>shop.example.com</code>.",
             body=TEXT_ONLY),
    ],
}


def tile(t):
    head = f'<h3>{t["title"]}</h3><p class="who">{t["who"]}</p><p class="ans">{t["ans"]}</p>'
    if t.get("wide"):
        return f'<div class="tile wide"><div>{head}</div><div>{t["body"]}</div></div>'
    return f'<div class="tile">{head}{t["body"]}</div>'


def gallery_page(tiles, mode):
    body = '<div class="row">' + "".join(tile(t) for t in tiles) + "</div>"
    return page(body, mode, GALLERY_CSS, width=1040)


# ---------------------------------------------------------------- one picture per reader

READER_CSS = GALLERY_CSS + """
.one{box-sizing:border-box;width:760px;border-radius:24px;padding:36px 40px 40px;background:var(--tile);display:flex;flex-direction:column}
.one .ans{font-size:16px;line-height:1.55;margin:0 0 26px;color:var(--text-primary)}
.one code{font-family:var(--font-mono);font-size:14px}
.one .bl{font-size:15px}.one .bl code{font-size:13.5px}.one .ans+.bl{margin-top:0}
"""

BILL = re.sub(r'<div class="gl-sec gl-tiles">.*?</div>\n</div>\n', '', demo("bill"), count=1, flags=re.S)

READERS = {
    "reader-oncall": ("<code>report-worker</code> is already over its memory limit and was killed 14 times in a day. <code>api</code> and <code>search</code> are close.", demo("memory")),
    "reader-frontend": ("Nearly half of the dashboard's main file is the chart library, and every page downloads it.", demo("bundle")),
    "reader-upgrade": ("The new database driver sped up four of seven endpoints and slowed three; <code>/search</code> now misses its 300 ms target.", demo("latency")),
    "reader-metric": ("Signups fell to about half on 12–15 March because the verification email stopped going out. They bounced back right after, and March still ended 4 % up.", demo("signups")),
    "reader-release": ("Only Windows is really broken: the file-watcher tests fail there on Node 20 and 22. Linux and macOS can ship.", demo("ci")),
    "reader-server": ("Get the Kestrel KS-8: it's the only option under your $40 budget with enough memory for Postgres plus two transcodes, and its traffic has no cap.", demo("vps")),
    "reader-bill": ("Your AWS bill more than doubled in October, almost all because of two changes in its first week.", BILL),
    "reader-bug": ("People get logged out after paying by card because the payment page sends them back to <code>www.shop.example.com</code>, and the login cookie only works on <code>shop.example.com</code>.", TEXT_ONLY),
}


def reader_page(ans, body, mode):
    return page(f'<div class="one"><p class="ans">{ans}</p>{body}</div>', mode, READER_CSS, width=760)


# ---------------------------------------------------------------- color figure

def deutan(h):
    """Simulate deuteranopia (Machado, Oliveira and Fernandes 2009, severity 1)."""
    m = [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]]
    s2l = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    l2s = lambda c: (lambda c: 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055)(max(0, min(1, c)))
    rgb = [s2l(int(h[i:i + 2], 16) / 255) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(l2s(sum(m[k][j] * rgb[j] for j in range(3))) * 255):02X}" for k in range(3))


# Pairs and their OKLab difference (x100) under deuteranopia, from the dataviz
# skill's validate_palette.js. 8 is the target for colors that must be told apart.
CVD_ROWS = [
    ("Alert red and warning amber", "#E24B4A", "over limit", "#BA7517", "tight", "3.2", False),
    ("Alert red and success green", "#E24B4A", "failing", "#639922", "passing", "2.1", False),
    ("Alert red and accent blue", "#E24B4A", "worse", "#378ADD", "recommended", "22.1", True),
]

CVD_CSS = """
.fig{box-sizing:border-box;width:1040px;border-radius:22px;padding:34px 36px 30px;background:var(--tile)}
:root{--tile:#F0EEE7}:root[data-mode=dark]{--tile:#232221}
.g{display:grid;grid-template-columns:230px minmax(0,1fr) minmax(0,1fr) 128px;column-gap:28px;align-items:center}
.g+.g{border-top:0.5px solid var(--border)}.g.rw{padding:18px 0}
.g>.h{font-size:13px;color:var(--text-secondary);padding-bottom:14px}
.g>.r,.g>.sc{text-align:right}
.lab{font-size:15px;color:var(--text-primary)}.lab.us{font-weight:500}
.pair{display:flex;gap:8px}
.sw{flex:1;border-radius:8px;height:44px;display:flex;align-items:flex-end;padding:0 0 0 0}
.wd{font-size:12px;color:var(--text-secondary);margin-top:6px;display:flex;gap:8px}.wd span{flex:1}
.sc{font-size:22px;font-weight:500;font-variant-numeric:tabular-nums;color:var(--text-primary);line-height:1.1}
.sc small{display:block;font-size:12px;font-weight:400;color:var(--text-secondary);margin-top:4px}
.note{font-size:12.5px;color:var(--text-muted);margin-top:18px;line-height:1.5}
"""


def cvd_page(mode):
    cells = ['<div class="g"><div class="h"></div><div class="h">Most people see</div>'
             '<div class="h">With red-green color blindness</div><div class="h r">Difference</div></div>']
    for label, a, wa, b, wb, de, ok in CVD_ROWS:
        def pair(x, y):
            return (f'<div><div class="pair"><div class="sw" style="background:{x}"></div><div class="sw" style="background:{y}"></div></div>'
                    f'<div class="wd"><span>{wa}</span><span>{wb}</span></div></div>')
        cells.append(f'<div class="g rw"><div class="lab{" us" if ok else ""}">{label}</div>{pair(a, b)}{pair(deutan(a), deutan(b))}'
                     f'<div class="sc">{de}<small>{"clear" if ok else "too close, needs 8"}</small></div></div>')
    body = (f'<div class="fig">{"".join(cells)}'
            '<p class="note">Deuteranopia simulated with Machado, Oliveira and Fernandes (2009). Difference is OKLab ΔE × 100, '
            'measured by the dataviz skill\'s palette validator. glance pairs red only with gray and blue, and every colored mark also carries a word.</p></div>')
    return page(body, mode, CVD_CSS, width=1040)


# ---------------------------------------------------------------- hero

HERO_CSS = """
html,body{background:transparent}
.hero{position:relative;width:1280px;height:720px;border-radius:30px;overflow:hidden;background:var(--canvas);font-family:var(--font-sans)}
.hero.t-light{--canvas:#ECEAE2}.hero.t-dark{--canvas:#191817}
.src{position:absolute;left:68px;top:64px;width:540px;color:var(--text-muted);font-size:14px;line-height:1.62;
  -webkit-mask-image:linear-gradient(to right,#000 22%,transparent 78%),linear-gradient(to bottom,#000 26%,transparent 80%);
  -webkit-mask-composite:source-in;mask-composite:intersect}
.src h3{font-size:26px;font-weight:500;color:var(--text-secondary);margin:0 0 16px;letter-spacing:-.018em;line-height:1.2}
.src h4{font-size:15px;font-weight:500;color:var(--text-secondary);margin:20px 0 6px}
.src p{margin:0 0 8px}.src b{color:var(--text-secondary);font-weight:500}
.src code{font-family:var(--font-mono);font-size:13.5px}
.src table{border-collapse:collapse;font-variant-numeric:tabular-nums;margin:6px 0 12px}
.src th,.src td{padding:4px 22px 4px 0;text-align:left;border-bottom:0.5px solid var(--border);font-weight:400}
.src th{color:var(--text-secondary);font-weight:500}
.src ul,.src ol{margin:0;padding-left:20px}.src li{margin:4px 0}
.card{position:absolute;border-radius:20px;padding:20px 22px 22px;background:var(--card);color:var(--text-primary)}
.card.t-light{--card:#FFFFFF;box-shadow:0 1px 2px rgba(48,38,28,.07),0 22px 48px -16px rgba(48,38,28,.26)}
.card.t-dark{--card:#2A2927;box-shadow:0 0 0 .5px rgba(255,255,255,.08),0 26px 56px -16px rgba(0,0,0,.66)}
.card .ans{font-size:15px;line-height:1.5;margin:0 0 16px;letter-spacing:-.003em}
.card code{font-family:var(--font-mono);font-size:13.5px}
.card .gl-line{height:150px}
.k-cmp{left:908px;top:44px;width:600px;z-index:1}.k-cmp .ans{max-width:318px}
.k-line{left:448px;top:60px;width:440px;z-index:2}
.k-mtr{left:512px;top:300px;width:530px;z-index:3}
.k-split{left:1062px;top:452px;width:360px;z-index:4}.k-split .ans{max-width:190px}
.k-dv{left:572px;top:580px;width:462px;z-index:5}
.ask{position:absolute;left:68px;top:612px;width:400px;height:60px;border-radius:18px;background:var(--card);z-index:6;
  display:flex;align-items:center;padding:0 10px 0 22px}
.ask.t-light{--card:#FFFFFF;box-shadow:0 1px 2px rgba(48,38,28,.07),0 18px 40px -16px rgba(48,38,28,.26)}
.ask.t-dark{--card:#2A2927;box-shadow:0 0 0 .5px rgba(255,255,255,.08),0 22px 48px -16px rgba(0,0,0,.66)}
.cmd{font-family:var(--font-mono);font-size:18px;color:var(--text-primary)}
.caret{width:2px;height:22px;margin-left:3px;background:var(--text-primary);border-radius:1px}
.send{margin-left:auto;width:40px;height:40px;border-radius:12px;background:#C6613F;position:relative}
.send::before{content:"";position:absolute;left:19px;top:12px;width:2px;height:17px;background:#fff;border-radius:1px}
.send::after{content:"";position:absolute;left:14px;top:13px;width:8px;height:8px;border-left:2px solid #fff;border-top:2px solid #fff;transform:rotate(45deg);border-radius:1px}
"""


def hero_page(mode):
    a, b = ("t-light", "t-dark") if mode == "light" else ("t-dark", "t-light")
    body = (HERE / "hero.html").read_text().replace("{BASE}", a).replace("{A}", a).replace("{B}", b)
    return page(body, mode, scoped_tokens() + HERO_CSS, width=1280, frame=False)


# ---------------------------------------------------------------- shared

def page(body, mode, extra, width, frame=True):
    host = (HERE / "host.css").as_uri()
    return (
        f'<!doctype html><html data-mode="{mode}"><head><meta charset="utf-8">'
        f'<link rel="stylesheet" href="{host}"><style>{kit_css()}{extra}'
        f"html,body{{background:transparent;margin:0}}body{{width:{width}px}}</style></head>"
        f"<body>{body}</body></html>"
    )


def pages():
    out = {}
    for mode in MODES:
        out[f"hero-{mode}"] = (hero_page(mode), 1280, 720)
        out[f"color-{mode}"] = (cvd_page(mode), 1040, None)
        for name, (ans, body) in READERS.items():
            out[f"{name}-{mode}"] = (reader_page(ans, body, mode), 760, None)
    return out


def shoot(html_file, png, width, height):
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=2", "--default-background-color=00000000",
                    "--virtual-time-budget=8000", f"--window-size={width},{height or 2000}",
                    f"--screenshot={png}", html_file.as_uri()], check=True, capture_output=True, timeout=120)
    if not height:  # crop the transparent space below the content
        im = Image.open(png)
        box = im.getchannel("A").getbbox()
        if box:
            im.crop((0, 0, im.width, box[3])).save(png)


def main():
    OUT.mkdir(exist_ok=True)
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    built = []
    for name, (html, width, height) in pages().items():
        if only and not any(name.startswith(o) for o in only):
            continue
        f = OUT / f"{name}.html"
        f.write_text(html)
        built.append((name, f, width, height))
    print(f"{len(built)} pages in {OUT}")
    if "--png" in sys.argv:
        IMG.mkdir(parents=True, exist_ok=True)
        for name, f, width, height in built:
            png = IMG / f"{name}.png"
            shoot(f, png, width, height)
            print("wrote", png.relative_to(ROOT))


if __name__ == "__main__":
    main()
