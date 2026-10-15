# Tools

Scripts used to add champions and to build the map. Run every command from the `champions-grid/` folder.

## Adding a champion

1. **Data**: create `src/data/champions/<slug>.json`, copying an existing champion as a template. `<slug>` is the file name (lowercase, no spaces) and is used in the URL, `/champion/<slug>`.
   - Allowed roles, classes, difficulties, attack and damage types, and tags are listed in `src/data/vocabulary.json`. A new tag or class goes there first.
   - Interactions are keyed by the target's slug (`"kaneki": ["enemy", "..."]`). If that champion does not exist yet, the name is shown as text; once it is added, the link appears by itself.
2. **Render** (full scene, used in the grid):
   ```
   python tools/prepare_assets.py render <slug> path/to/render.png
   ```
   Then set `"render": "/renders/<slug>_render.webp"` in the JSON.
3. **Cutout** (figure with transparent background, used in the champion page):
   ```
   python tools/prepare_assets.py cutout <slug> path/to/render.png
   ```
   It warns if the figure comes out smaller than 650 px; in that case, use a bigger render or upscale it first (for example with Real-ESRGAN).
4. **Gallery**: drop the images in `src/assets/gallery/<slug>/` (they are shown in file-name order) and convert them:
   ```
   python tools/prepare_assets.py gallery <slug>
   ```
5. **Check**:
   ```
   npm run validate
   ```
   It lists anything missing or misspelled. Errors stop the check with exit code 1; warnings (such as an empty gallery) do not.

## Setup for the image tools

Python 3 with the packages in `requirements.txt`:

```
python -m pip install -r tools/requirements.txt
```

`render` and `gallery` only need Pillow. `cutout` uses rembg, which downloads its background-removal model (~200 MB) the first time.

## Minimap

```
node tools/generate-minimap.js
```

Writes `public/maps/minimap.svg`. Pits, corridors, towers and colours are defined at the top of the script; the random scatter of trees and rocks uses a fixed seed, so the same script always produces the same map.
