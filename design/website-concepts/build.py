"""Builds the concept sites into public/concepts/.

    python3 design/website-concepts/build.py

Templates use {{bar}} for the concept disclosure bar and {{img:key}} for
photos. images.json maps keys to hosted image URLs (filled in by
fetch_images.py); missing keys fall back to a labelled placeholder so
layouts can be checked before photos exist.
"""
import json
import re
import shutil
from html import escape
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parents[1] / "public" / "concepts"

SITES = {
    "saffron-and-salt": "Wix",
    "kora-wellness": "Wix",
    "aurelia-weddings": "Wix",
    "meridian-realty": "WordPress",
    "brightpath-academy": "WordPress",
    "harbor-hope": "WordPress",
    "oria-botanicals": "Shopify",
    "ember-and-oak": "Shopify",
    "ayo-and-indigo": "Shopify",
}

IMG = re.compile(r"\{\{img:([a-z0-9-]+)\}\}")


def placeholder(key: str) -> str:
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">'
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#9aa3ad"/><stop offset="1" stop-color="#5d6670"/>'
        "</linearGradient></defs>"
        '<rect width="1200" height="800" fill="url(#g)"/>'
        f'<text x="600" y="410" font-family="sans-serif" font-size="44" fill="#fff" '
        f'text-anchor="middle">{escape(key)}</text></svg>'
    )
    return "data:image/svg+xml," + quote(svg)


def bar(platform: str) -> str:
    return (
        '<div class="concept-bar" role="note">'
        f"<span><b>Concept site</b> designed by TolexTech for {platform}. "
        "Sample content; photos from Pexels.</span>"
        '<a href="/#websites">Back to the portfolio</a></div>'
    )


def main() -> None:
    images_file = ROOT / "images.json"
    images = json.loads(images_file.read_text()) if images_file.exists() else {}
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "assets").mkdir(exist_ok=True)
    for name in ("concept.css", "concept.js"):
        shutil.copy(ROOT / "shared" / name, OUT / "assets" / name)

    missing = set()
    for slug, platform in SITES.items():
        template = ROOT / "templates" / f"{slug}.html"
        if not template.exists():
            print(f"skipping {slug}: no template yet")
            continue
        html = template.read_text()
        html = html.replace("{{bar}}", bar(platform))

        def swap(match: re.Match) -> str:
            key = match.group(1)
            if key not in images:
                missing.add(key)
                return placeholder(key)
            return images[key]

        html = IMG.sub(swap, html)
        (OUT / f"{slug}.html").write_text(html)
    print(f"built {len(SITES)} sites into {OUT}")
    if missing:
        print(f"{len(missing)} images still placeholders")


if __name__ == "__main__":
    main()
