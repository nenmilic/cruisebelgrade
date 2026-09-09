import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";

const src = "public/img";
const out = "public/img/optimized";
await mkdir(out, { recursive: true });

for (const f of await readdir(src)) {
  if (!/\.jpe?g$/i.test(f)) continue;
  await sharp(`${src}/${f}`)
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(`${out}/${f}`);
  console.log(f);
}