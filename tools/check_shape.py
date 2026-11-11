"""Compare glance output's size with its source and look for box-drawing diagrams.

Usage: python check_shape.py <source.md> <output.md>
Lines = all lines (like wc -l); text lines = non-empty lines. Words = word-like tokens, ignoring markdown symbols.
"""
import re
import sys

BOX = set("┌┐└┘├┤┬┴┼│─━┃═║╔╗╚╝▶◀▼▲")


def stats(text):
    lines = [l for l in text.splitlines() if l.strip()]
    words = re.findall(r"[\w$%µΩ][\w.,$%µΩ/'-]*", text)
    return len(lines), len(words)


def main():
    src = open(sys.argv[1], encoding="utf-8").read()
    out = open(sys.argv[2], encoding="utf-8").read()
    sl, sw = stats(src)
    ol, ow = stats(out)
    st, ot = src.count("\n"), out.count("\n")
    print(f"all lines {ot}/{st} ({ot / st:.0%})")
    box = sorted({c for c in out if c in BOX})
    print(f"text lines {ol}/{sl} ({ol / sl:.0%})  words {ow}/{sw} ({ow / sw:.0%})")
    print("box-drawing chars:", "".join(box) if box else "none")
    ok = ot < st and ow < sw and not box
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
