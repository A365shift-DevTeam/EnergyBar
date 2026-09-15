// Uploads the scroll animation frames to Cloudinary.
// Usage: node --env-file=.env.local scripts/upload-frames-cloudinary.mjs [--limit N]
// Re-runnable: frames that already exist in the folder are skipped.
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

const SOURCE_DIR = path.resolve('public/1st-product');
const FOLDER = 'energy-bar-frames';
const CONCURRENCY = 8;

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('Missing CLOUDINARY_* variables. Run with --env-file=.env.local');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const limitIndex = process.argv.indexOf('--limit');
const limit = limitIndex > -1 ? Number(process.argv[limitIndex + 1]) : Infinity;

const files = (await readdir(SOURCE_DIR)).filter((file) => file.endsWith('.webp')).sort().slice(0, limit);

const existing = new Set();
let cursor;
do {
  const page = await cloudinary.api.resources_by_asset_folder(FOLDER, { max_results: 500, next_cursor: cursor })
    .catch(() => ({ resources: [] }));
  for (const resource of page.resources) existing.add(resource.public_id);
  cursor = page.next_cursor;
} while (cursor);

const queue = files.filter((file) => !existing.has(`${FOLDER}/${path.parse(file).name}`));
console.log(`${files.length} frames, ${files.length - queue.length} already uploaded, ${queue.length} to upload`);

const failures = [];
let done = 0;

async function worker() {
  while (queue.length) {
    const file = queue.shift();
    const name = path.parse(file).name;
    try {
      await cloudinary.uploader.upload(path.join(SOURCE_DIR, file), {
        public_id: `${FOLDER}/${name}`,
        asset_folder: FOLDER,
        resource_type: 'image',
        overwrite: false,
        unique_filename: false,
      });
      done += 1;
      if (done % 20 === 0) console.log(`uploaded ${done}`);
    } catch (error) {
      failures.push(file);
      console.error(`failed ${file}: ${error.message ?? error.error?.message}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`done: ${done} uploaded, ${failures.length} failed`);
if (failures.length) process.exit(1);
