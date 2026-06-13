// One-off: optimize selected real VG Контур work photos from references/Photo
// into web-ready WebP files under assets/optimized/works.
// Run: node scripts/optimize-works.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "references", "Photo");
const OUT = path.join(ROOT, "assets", "optimized", "works");

// [sourceRelativeToReferencesPhoto, outputFileName]
const MAP = [
  // Внутренняя отделка
  ["finishing work/photo_2026-06-11_14-20-00 (2).jpg", "finishing-01.webp"],
  ["finishing work/photo_2026-06-11_14-19-59 (3).jpg", "finishing-02.webp"],
  ["finishing work/photo_2026-06-11_14-20-01.jpg", "finishing-03.webp"],
  ["finishing work/photo_2026-06-11_14-20-03.jpg", "finishing-04.webp"],
  ["finishing work/photo_2026-06-11_14-19-59 (2).jpg", "finishing-05.webp"],
  ["finishing work/photo_2026-06-11_14-19-59.jpg", "finishing-06.webp"],
  ["finishing work/photo_2026-06-11_14-20-03 (2).jpg", "finishing-07.webp"],
  ["finishing work/photo_2026-06-11_14-20-12.jpg", "finishing-08.webp"],
  // Строительство домов
  ["Home Builders/photo_2026-06-11_14-20-11.jpg", "houses-01.webp"],
  ["Home Builders/photo_2026-06-11_14-20-04.jpg", "houses-02.webp"],
  ["Home Builders/photo_2026-06-11_14-20-05.jpg", "houses-03.webp"],
  ["Home Builders/photo_2026-06-11_14-20-02.jpg", "houses-04.webp"],
  ["Home Builders/photo_2026-06-11_14-20-09.jpg", "houses-05.webp"],
  ["Home Builders/photo_2026-06-11_14-20-01 (2).jpg", "houses-06.webp"],
  // Фасадные работы
  ["Exterior work/photo_2026-06-11_14-20-14.jpg", "facade-01.webp"],
  ["Exterior work/photo_2026-06-11_14-20-16.jpg", "facade-02.webp"],
  ["Exterior work/photo_2026-06-11_14-20-15.jpg", "facade-03.webp"],
  ["Exterior work/photo_2026-06-11_14-20-14 (2).jpg", "facade-04.webp"],
  // Ландшафтные работы
  ["Landscape construction work/photo_2026-06-11_14-20-08.jpg", "landscape-01.webp"],
  ["Landscape construction work/photo_2026-06-11_14-20-06.jpg", "landscape-02.webp"],
  ["Landscape construction work/photo_2026-06-11_14-20-06 (2).jpg", "landscape-03.webp"],
  // Промышленное строительство
  ["Industrial construction work/photo_2026-06-11_14-20-19.jpg", "industrial-01.webp"],
  ["Industrial construction work/photo_2026-06-11_14-20-21.jpg", "industrial-02.webp"],
  ["Industrial construction work/photo_2026-06-11_14-20-18.jpg", "industrial-03.webp"],
  ["Industrial construction work/photo_2026-06-11_14-20-20.jpg", "industrial-04.webp"],
  ["Industrial construction work/photo_2026-06-11_14-20-22.jpg", "industrial-05.webp"],
  ["Industrial construction work/photo_2026-06-11_14-20-24.jpg", "industrial-06.webp"]
];

await mkdir(OUT, { recursive: true });

for (const [rel, outName] of MAP) {
  const inPath = path.join(SRC, rel);
  const outPath = path.join(OUT, outName);
  const info = await sharp(inPath)
    .rotate() // respect EXIF orientation
    .resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(outPath);
  console.log(`${outName}\t${info.width}x${info.height}\t${Math.round(info.size / 1024)}KB`);
}

console.log(`\nDone: ${MAP.length} files -> assets/optimized/works`);
