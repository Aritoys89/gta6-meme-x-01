// Entry point for the gta6-meme-x-01 submission.
//
// The deliverable of this repo is a single published post, recorded in
// POST.json. Judges run this file to collect that record: it copies
// POST.json into the output directory so the post can be graded
// without digging through the repo.
//
// Output location: /output by default, or $MAKEFUN_OUTPUT_DIR when
// the runner provides one.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const sourcePath = join(process.cwd(), "POST.json");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(outputDir, "POST.json");

const payload = readFileSync(sourcePath, "utf8");

// Fail loudly on a malformed record instead of handing the judges a
// broken file: POST.json must be JSON with an https x.com post URL.
let record;
try {
  record = JSON.parse(payload);
} catch {
  console.error(`error: ${sourcePath} is not valid JSON`);
  process.exit(1);
}
if (typeof record?.url !== "string" || !/^https:\/\/x\.com\/\S+$/.test(record.url)) {
  console.error(`error: ${sourcePath} must contain an https://x.com post URL in its "url" field`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(targetPath, payload);

console.log(`wrote ${targetPath} (${payload.length} bytes)`);
