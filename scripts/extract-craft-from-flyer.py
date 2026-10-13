#!/usr/bin/env python3
"""Extract sharp craft + hero images from public/images/flyer.jpg (no phone UI)."""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
FLYER = ROOT / 'public/images/flyer.jpg'
OUT = ROOT / 'public/images/craft'
HERO = ROOT / 'public/images/hero-main-door.jpg'


def enhance(img: Image.Image, scale: float) -> Image.Image:
    w, h = img.size
    if scale > 1:
        img = img.resize(
            (max(1, int(w * scale)), max(1, int(h * scale))),
            Image.Resampling.LANCZOS,
        )
    img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=140, threshold=2))
    img = ImageEnhance.Contrast(img).enhance(1.06)
    img = ImageEnhance.Sharpness(img).enhance(1.35)
    return img


def save_jpg(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img.save(path, quality=94, optimize=True, subsampling=0)


def crop_cell(grid: Image.Image, row: int, col: int) -> Image.Image:
    gw, gh = grid.size
    x1 = col * gw // 2 + 3
    x2 = (col + 1) * gw // 2 - 3
    y1 = row * gh // 3 + 3
    y2 = (row + 1) * gh // 3 - 3
    cell = grid.crop((x1, y1, x2, y2))
    return cell.crop((2, 2, cell.width - 2, int(cell.height * 0.72)))


def split_halves(img: Image.Image) -> tuple[Image.Image, Image.Image]:
    w, h = img.size
    return img.crop((0, 0, w // 2, h)), img.crop((w // 2, 0, w, h))


def main() -> None:
    im = Image.open(FLYER).convert('RGB')

    # Product band — excludes Mi Home bar (top) and Reply UI (bottom)
    band = im.crop((4, 292, 466, 678))

    # Hero: main carved door with craftsman (widest clean crop from flyer)
    hero_src = im.crop((6, 282, 236, 692))
    save_jpg(enhance(hero_src, scale=3.2), HERO)

    main_src = band.crop((0, 12, 210, band.size[1]))
    save_jpg(enhance(main_src, scale=3.0), OUT / '01-main-door.jpg')

    grid = band.crop((228, 108, band.size[0], band.size[1]))

    row0_pair = crop_cell(grid, 0, 0)
    frames, doors = split_halves(row0_pair)
    save_jpg(enhance(frames, scale=6.0), OUT / '02-door-frames.jpg')
    save_jpg(enhance(doors, scale=6.0), OUT / '03-doors.jpg')

    save_jpg(enhance(crop_cell(grid, 0, 1), scale=5.5), OUT / '04-windows.jpg')

    row1_pair = crop_cell(grid, 1, 0)
    shutters, beds = split_halves(row1_pair)
    save_jpg(enhance(shutters, scale=5.5), OUT / '05-window-shutters.jpg')
    save_jpg(enhance(beds, scale=5.5), OUT / '06-beds.jpg')

    save_jpg(enhance(crop_cell(grid, 2, 0), scale=5.5), OUT / '07-tables.jpg')

    print(f'Wrote {HERO} and craft images to {OUT}')


if __name__ == '__main__':
    main()
