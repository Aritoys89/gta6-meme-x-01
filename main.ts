// Entry point for the gta6-meme-x-01 make.fun entry.
//
// The grader mounts this repository read-only and starts this file from an
// unrelated working directory, so nothing here may be resolved from
// process.cwd(). POST.json always sits beside this script: the directory
// comes from MAKEFUN_BOT_DIR when the runner provides it, and otherwise
// from this file's own folder.

const fs = require("node:fs");
const path = require("node:path");

function botDir() {
  const fromEnv = process.env.MAKEFUN_BOT_DIR;
  if (typeof fromEnv === "string" && fromEnv.trim() !== "") {
    return fromEnv;
  }
  return __dirname;
}

function outputDir() {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (typeof fromEnv === "string" && fromEnv.trim() !== "") {
    return fromEnv;
  }
  return "/output";
}

function readPostJson() {
  const postPath = path.join(botDir(), "POST.json");
  let raw;
  try {
    raw = fs.readFileSync(postPath);
  } catch (err) {
    throw new Error("cannot read POST.json at " + postPath + ": " + err.message);
  }

  let data;
  try {
    data = JSON.parse(raw.toString("utf8"));
  } catch (err) {
    throw new Error("POST.json is not valid JSON: " + err.message);
  }

  const url = data && typeof data.url === "string" ? data.url : "";
  let parsed;
  try {
    parsed = new URL(url);
  } catch (err) {
    throw new Error("POST.json does not contain a usable url field");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("post URL must use https, got: " + url);
  }
  if (parsed.hostname !== "x.com" && !parsed.hostname.endsWith(".x.com")) {
    throw new Error("post URL must be on x.com, got host: " + parsed.hostname);
  }
  if (!parsed.pathname.includes("/status/")) {
    throw new Error("post URL must point at a post (missing /status/): " + url);
  }

  return raw;
}

function main() {
  const raw = readPostJson();
  const targetDir = outputDir();
  fs.mkdirSync(targetDir, { recursive: true });
  const target = path.join(targetDir, "POST.json");
  fs.writeFileSync(target, raw);
  console.log("wrote " + target + " (" + raw.length + " bytes)");
}

try {
  main();
} catch (err) {
  console.error("meme entry failed: " + (err && err.message ? err.message : err));
  process.exit(1);
}
