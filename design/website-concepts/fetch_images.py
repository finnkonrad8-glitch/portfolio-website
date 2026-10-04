"""Finds and hosts the concept-site photos. Runs inside the Macaly sandbox,
which has the Pexels proxy and asset upload credentials.

    python3 fetch_images.py search saffron        # list candidates per key
    python3 fetch_images.py fetch '{"saffron-hero": 2}'   # host picks (index)

search caches candidates in /tmp/concept-cands.json. fetch downloads each
pick at the width set in queries.json, converts it to WebP, uploads it to
the app's asset store and merges key -> URL into /tmp/concept-images.json
(and the photographer credit into /tmp/concept-credits.json). Keys left out
of the picks JSON use candidate 0.
"""
import io
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
QUERIES = json.loads((ROOT / "queries.json").read_text())
CANDS = Path("/tmp/concept-cands.json")
IMAGES = Path("/tmp/concept-images.json")
CREDITS = Path("/tmp/concept-credits.json")
BASE = os.environ["MACALY_BASE_URL"]
TOKEN = os.environ["MACALY_API_TOKEN"]
CHAT = os.environ["MACALY_CHAT_ID"]


def load(path: Path) -> dict:
    return json.loads(path.read_text()) if path.exists() else {}


def pexels(query: str, orientation: str) -> list:
    body = json.dumps(
        {"chatId": CHAT, "query": query, "orientation": orientation, "per_page": 8}
    ).encode()
    req = urllib.request.Request(
        f"{BASE}/api/client-app/pexels",
        data=body,
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=40) as res:
        return json.load(res).get("photos", [])


def search(prefixes: list) -> None:
    cands = load(CANDS)
    for key, spec in QUERIES.items():
        if prefixes and not any(key.startswith(p) for p in prefixes):
            continue
        photos = pexels(spec["q"], spec["o"])
        cands[key] = [
            {
                "id": p["id"],
                "src": p["src"]["original"],
                "alt": p.get("alt") or "",
                "by": p.get("photographer", ""),
                "url": p.get("url", ""),
                "size": f'{p.get("width", "?")}x{p.get("height", "?")}',
            }
            for p in photos
        ]
        print(key)
        for i, c in enumerate(cands[key][:6]):
            print(f'  {i} {c["size"]} {c["alt"][:80]}')
    CANDS.write_text(json.dumps(cands))


def upload(path: Path, key: str) -> str:
    folder = "concepts/" + key.split("-")[0]
    out = subprocess.run(
        [
            "curl", "-sS", "-X", "POST", f"{BASE}/api/client-app/assets/upload",
            "-H", f"Authorization: Bearer {TOKEN}",
            "-F", f"chatId={CHAT}",
            "-F", f"file=@{path};type=image/webp",
            "-F", f"folderPath={folder}",
            "-F", "createFolders=true",
            "-F", f"title={key}",
        ],
        capture_output=True, text=True, check=True,
    ).stdout
    return json.loads(out)["asset"]["url"]


def fetch(picks: dict) -> None:
    cands, images, credits = load(CANDS), load(IMAGES), load(CREDITS)
    keys = list(picks) if picks else [k for k in QUERIES if k not in images]
    for key in keys:
        choice = cands[key][int(picks.get(key, 0))]
        width = QUERIES[key]["w"]
        src = f'{choice["src"]}?auto=compress&cs=tinysrgb&w={width}'
        with urllib.request.urlopen(src, timeout=60) as res:
            img = Image.open(io.BytesIO(res.read())).convert("RGB")
        if img.width > width:
            img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
        tmp = Path(f"/tmp/{key}.webp")
        img.save(tmp, "WEBP", quality=80, method=6)
        images[key] = upload(tmp, key)
        credits[key] = f'{choice["by"]} {choice["url"]}'
        print(key, img.size, tmp.stat().st_size // 1024, "KB")
    IMAGES.write_text(json.dumps(images, indent=1))
    CREDITS.write_text(json.dumps(credits, indent=1))


if __name__ == "__main__":
    mode, *rest = sys.argv[1:]
    if mode == "search":
        search(rest)
    else:
        fetch(json.loads(rest[0]) if rest else {})
