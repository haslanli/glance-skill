"""Check that every number in a source report also appears in the glance output.

Usage: python check_numbers.py <source.md> <output.md>
Ignores list numbering at line starts ("1. ", "3. ").
"""
import re
import sys


def numbers(text, skip_list_markers):
    if skip_list_markers:
        text = re.sub(r"(?m)^\s*\d+\.\s", " ", text)
    found = set()
    for m in re.finditer(r"(?<![\w.])\d[\d,]*(?:\.\d+)?", text):
        n = m.group(0).replace(",", "").rstrip(".")
        if n:
            found.add(n)
    return found


def main():
    src = open(sys.argv[1], encoding="utf-8").read()
    out = open(sys.argv[2], encoding="utf-8").read()
    need = numbers(src, skip_list_markers=True)
    have = numbers(out, skip_list_markers=False)
    missing = sorted(need - have, key=lambda s: float(s))
    print(f"{len(need) - len(missing)}/{len(need)} numbers kept")
    if missing:
        print("missing:", ", ".join(missing))
    sys.exit(1 if missing else 0)


if __name__ == "__main__":
    main()
