"""Image tools for Sanctus Caelum champions. Run them from the champions-grid folder.

    python tools/prepare_assets.py render  <slug> <image>   -> public/renders/<slug>_render.webp
    python tools/prepare_assets.py cutout  <slug> <image>   -> public/cutouts/<slug>.webp
    python tools/prepare_assets.py gallery [<slug> ...]     -> converts src/assets/gallery/<slug>/ to WebP

<slug> is the champion's JSON file name without ".json" (gojo, android18...).
"cutout" needs rembg (see tools/requirements.txt); the other two only need Pillow.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RENDERS = ROOT / "public" / "renders"
CUTOUTS = ROOT / "public" / "cutouts"
GALLERY = ROOT / "src" / "assets" / "gallery"

RENDER_WIDTH = 960       # grid cards and "explore" cards never show it wider than ~490 px
CUTOUT_HEIGHT = 1200     # the detail page shows the figure ~590 px tall (x2 for sharp screens)
GALLERY_SIDE = 2000      # longest side of a gallery image, enough for the full-screen viewer
SOURCE_TYPES = {".png", ".jpg", ".jpeg"}


def render(slug, source):
    image = Image.open(source).convert("RGB")
    if image.width > RENDER_WIDTH:
        image = image.resize((RENDER_WIDTH, round(image.height * RENDER_WIDTH / image.width)), Image.LANCZOS)
    target = RENDERS / f"{slug}_render.webp"
    image.save(target, "WEBP", quality=80, method=6)
    print(f"{target.relative_to(ROOT)}  {image.size}  {target.stat().st_size // 1024} KB")
    print(f'Set "render": "/renders/{slug}_render.webp" in the champion JSON.')


def cutout(slug, source):
    from rembg import new_session, remove  # imported here so the other commands work without rembg

    image = Image.open(source).convert("RGB")
    figure = remove(image, session=new_session("birefnet-general-lite"), post_process_mask=False)
    # drop the faint haze the model leaves around the figure, then crop to it with a small margin
    alpha = figure.getchannel("A").point(lambda value: 0 if value < 6 else value)
    figure.putalpha(alpha)
    left, top, right, bottom = alpha.getbbox()
    margin = 6
    figure = figure.crop((max(0, left - margin), max(0, top - margin),
                          min(figure.width, right + margin), min(figure.height, bottom + margin)))
    if figure.height > CUTOUT_HEIGHT:
        figure = figure.resize((round(figure.width * CUTOUT_HEIGHT / figure.height), CUTOUT_HEIGHT), Image.LANCZOS)
    target = CUTOUTS / f"{slug}.webp"
    figure.save(target, "WEBP", quality=88, alpha_quality=95, method=6)
    print(f"{target.relative_to(ROOT)}  {figure.size}  {target.stat().st_size // 1024} KB")
    if figure.height < 650:
        print("Warning: the figure is less than 650 px tall and will look soft. Use a bigger render if you can.")


def gallery(slugs):
    folders = [GALLERY / slug for slug in slugs] if slugs else sorted(p for p in GALLERY.iterdir() if p.is_dir())
    for folder in folders:
        for source in sorted(folder.iterdir()):
            if source.suffix.lower() not in SOURCE_TYPES:
                continue
            image = Image.open(source)
            transparent = "A" in image.getbands() or "transparency" in image.info
            image = image.convert("RGBA" if transparent else "RGB")
            image.thumbnail((GALLERY_SIDE, GALLERY_SIDE), Image.LANCZOS)
            target = source.with_suffix(".webp")
            counter = 2
            while target.exists():  # image1.png and image1.jpg in the same folder
                target = source.with_name(f"{source.stem}-{counter}.webp")
                counter += 1
            image.save(target, "WEBP", quality=82, method=6)
            before, after = source.stat().st_size, target.stat().st_size
            source.unlink()
            print(f"{target.relative_to(ROOT)}  {before // 1024} KB -> {after // 1024} KB")


if __name__ == "__main__":
    command, *args = sys.argv[1:] or ["help"]
    if command == "render" and len(args) == 2:
        render(*args)
    elif command == "cutout" and len(args) == 2:
        cutout(*args)
    elif command == "gallery":
        gallery(args)
    else:
        print(__doc__)
        sys.exit(1)
