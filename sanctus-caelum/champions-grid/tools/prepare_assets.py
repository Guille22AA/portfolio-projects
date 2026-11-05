"""Image tools for Sanctus Caelum champions. Run them from the champions-grid folder.

    python tools/prepare_assets.py render  <slug> <image>   -> public/renders/<slug>_render.webp
    python tools/prepare_assets.py cutout  <slug> <image>   -> public/cutouts/<slug>.webp
    python tools/prepare_assets.py gallery [<slug> ...]     -> converts src/assets/gallery/<slug>/ to WebP
    python tools/prepare_assets.py stage   <slug> [height] [shift]
        -> puts public/cutouts/<slug>.webp on the shared stage and writes public/renders/<slug>_render.webp
           height: figure height relative to the standard (1.0); shift: pixels to move it sideways

<slug> is the champion's JSON file name without ".json" (gojo, android18...).
"cutout" needs rembg (see tools/requirements.txt); the others only need Pillow and numpy.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RENDERS = ROOT / "public" / "renders"
CUTOUTS = ROOT / "public" / "cutouts"
GALLERY = ROOT / "src" / "assets" / "gallery"
STAGE = Path(__file__).resolve().parent / "stage" / "background.png"
# where the figure stands on the stage background (measured on the render it was taken from)
STAGE_FIGURE_TOP, STAGE_FEET, STAGE_CENTER_X = 48, 733, 683

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


def stage(slug, height="1.0", shift="0"):
    """Every grid render shares one stage: same background, feet line, figure size and cast shadow."""
    import numpy as np
    from PIL import ImageFilter

    plate = Image.open(STAGE).convert("RGB")
    figure = Image.open(CUTOUTS / f"{slug}.webp").convert("RGBA")
    target_height = int((STAGE_FEET - STAGE_FIGURE_TOP) * float(height))
    figure = figure.resize((round(figure.width * target_height / figure.height), target_height), Image.LANCZOS)
    x = STAGE_CENTER_X - figure.width // 2 + int(shift)
    y = STAGE_FEET - figure.height + 4

    # cast shadow: the silhouette projected back and to the right, fading with distance
    silhouette = Image.new("L", plate.size, 0)
    silhouette.paste(figure.getchannel("A"), (x, y))
    feet = float(y + figure.height - 4)
    drift, squash = 0.55, 0.22
    shadow = silhouette.transform(plate.size, Image.AFFINE,
                                  (1, drift / squash, -(drift / squash) * feet, 0, 1 / squash, feet - feet / squash),
                                  resample=Image.BILINEAR)
    rows = np.arange(plate.size[1], dtype=np.float32)
    fade = np.clip(1 - (feet - rows) / max(figure.height * squash, 1), 0, 1)
    fade = np.where(rows > feet + 2, 0, fade)
    shadow = Image.fromarray((np.asarray(shadow, np.float32) * fade[:, None] * 0.42).astype(np.uint8))
    plate = Image.composite(Image.new("RGB", plate.size, (10, 18, 32)), plate, shadow.filter(ImageFilter.GaussianBlur(5)))

    # faint reflection on the glossy floor
    reflection = figure.transpose(Image.FLIP_TOP_BOTTOM)
    ramp = np.clip(1 - np.arange(reflection.height, dtype=np.float32) / 70, 0, 1)[:, None] * 0.14
    reflection.putalpha(Image.fromarray((np.asarray(reflection.getchannel("A"), np.float32) * ramp).astype(np.uint8)))
    plate.paste(reflection.filter(ImageFilter.GaussianBlur(1.5)), (x, int(feet) - 2), reflection)

    plate.paste(figure, (x, y), figure)
    out = RENDERS / f"{slug}_render.webp"
    plate.save(STAGE.parent / "_last_stage.png")
    render(slug, STAGE.parent / "_last_stage.png")
    (STAGE.parent / "_last_stage.png").unlink()


if __name__ == "__main__":
    command, *args = sys.argv[1:] or ["help"]
    if command == "render" and len(args) == 2:
        render(*args)
    elif command == "cutout" and len(args) == 2:
        cutout(*args)
    elif command == "gallery":
        gallery(args)
    elif command == "stage" and 1 <= len(args) <= 3:
        stage(*args)
    else:
        print(__doc__)
        sys.exit(1)
