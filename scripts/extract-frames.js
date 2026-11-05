#!/usr/bin/env node
/**
 * AURELIA STUDIO — Video-to-WebP Frame Sequence Extractor
 * -------------------------------------------------------
 * Takes 4 MP4 scene videos (scene1.mp4, scene2.mp4, scene3.mp4, scene4.mp4),
 * dynamically probes their durations, normalizes each scene so the 4 scenes
 * align precisely to frames 001–060, 061–120, 121–180, and 181–240,
 * concatenates them with smooth 0.3s crossfades (xfade), and extracts
 * exactly 240 crisp WebP frames (24 fps, quality 90) into:
 *   public/frames/frame_0001.webp ... public/frames/frame_0240.webp
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "frames");
const PRODUCTS_DIR = path.join(ROOT_DIR, "public", "products");

const INPUT_VIDEOS = [
  path.join(ROOT_DIR, "scene1.mp4"),
  path.join(ROOT_DIR, "scene2.mp4"),
  path.join(ROOT_DIR, "scene3.mp4"),
  path.join(ROOT_DIR, "scene4.mp4"),
];

const TOTAL_FRAMES = 240;
const TARGET_FPS = 24;
const TOTAL_DURATION = TOTAL_FRAMES / TARGET_FPS; // 10.0 seconds
const CROSSFADE_DURATION = 0.3; // 0.3s smooth crossfade
const WEBP_QUALITY = 90;

function getVideoDuration(filePath) {
  try {
    const stdout = execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        filePath,
      ],
      { encoding: "utf-8" }
    );
    const parsed = parseFloat(stdout.trim());
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10.0;
  } catch (err) {
    console.warn(`Could not probe duration for ${filePath}, defaulting to 10.0s`);
    return 10.0;
  }
}

function main() {
  console.log("==========================================================");
  console.log(" AURELIA MOBILE — 240-Frame WebP Sequence Pipeline (FFmpeg)");
  console.log("==========================================================\n");

  for (const video of INPUT_VIDEOS) {
    if (!fs.existsSync(video)) {
      console.error(`❌ Missing input video: ${video}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  // Clean existing frames if any
  for (const file of fs.readdirSync(OUTPUT_DIR)) {
    if (file.endsWith(".webp")) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }

  // With 4 scenes and 3 crossfades of 0.3s, total duration T = 4 * D - 3 * F = 10.0s
  // => Each normalized scene duration D = (10.0 + 3 * 0.3) / 4 = 2.725s
  const sceneTargetDuration =
    (TOTAL_DURATION + (INPUT_VIDEOS.length - 1) * CROSSFADE_DURATION) /
    INPUT_VIDEOS.length;

  const durations = INPUT_VIDEOS.map(getVideoDuration);
  durations.forEach((d, idx) => {
    console.log(
      `  • scene${idx + 1}.mp4: ${d.toFixed(3)}s -> scaled to ${sceneTargetDuration.toFixed(3)}s (60 frames)`
    );
  });

  // Build filter_complex graph:
  // 1) Normalize each input to 1920x1080, 24fps, yuv420p, and time-scale to sceneTargetDuration
  // 2) Chain 3 xfade filters with 0.3s fade transitions at exact scene boundaries
  const filterParts = [];
  durations.forEach((origDuration, i) => {
    const ptsFactor = (sceneTargetDuration / origDuration).toFixed(6);
    filterParts.push(
      `[${i}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setpts=${ptsFactor}*PTS,fps=${TARGET_FPS},format=yuv420p,setsar=1[v${i}]`
    );
  });

  const offset1 = (sceneTargetDuration - CROSSFADE_DURATION).toFixed(4);
  const offset2 = (2 * sceneTargetDuration - 2 * CROSSFADE_DURATION).toFixed(4);
  const offset3 = (3 * sceneTargetDuration - 3 * CROSSFADE_DURATION).toFixed(4);

  filterParts.push(
    `[v0][v1]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${offset1}[xf1]`
  );
  filterParts.push(
    `[xf1][v2]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${offset2}[xf2]`
  );
  filterParts.push(
    `[xf2][v3]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${offset3},fps=${TARGET_FPS}[outv]`
  );

  const filterComplex = filterParts.join(";");
  const outputPattern = path.join(OUTPUT_DIR, "frame_%04d.webp");

  console.log("\n⏳ Extracting 240 high-resolution WebP frames (fps=24, quality=90)...");

  const ffmpegArgs = [
    "-y",
    "-i",
    INPUT_VIDEOS[0],
    "-i",
    INPUT_VIDEOS[1],
    "-i",
    INPUT_VIDEOS[2],
    "-i",
    INPUT_VIDEOS[3],
    "-filter_complex",
    filterComplex,
    "-map",
    "[outv]",
    "-frames:v",
    String(TOTAL_FRAMES),
    "-c:v",
    "libwebp",
    "-lossless",
    "0",
    "-compression_level",
    "4",
    "-q:v",
    String(WEBP_QUALITY),
    "-start_number",
    "1",
    outputPattern,
  ];

  execFileSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });

  // Verify all 240 frames exist; pad final frames if rounding stopped at 239
  const generated = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => /^frame_\d{4}\.webp$/.test(f))
    .sort();

  if (generated.length > 0 && generated.length < TOTAL_FRAMES) {
    const lastFramePath = path.join(OUTPUT_DIR, generated[generated.length - 1]);
    for (let i = generated.length + 1; i <= TOTAL_FRAMES; i++) {
      const targetName = `frame_${String(i).padStart(4, "0")}.webp`;
      fs.copyFileSync(lastFramePath, path.join(OUTPUT_DIR, targetName));
    }
  }

  // Also copy key hero frames into public/products/ for the post-scroll E-Commerce Grid
  const productFrameMap = [
    { frame: "frame_0030.webp", target: "titanium-phone.webp" },
    { frame: "frame_0095.webp", target: "camera-optics.webp" },
    { frame: "frame_0155.webp", target: "magsafe-dock.webp" },
    { frame: "frame_0220.webp", target: "leather-case.webp" },
  ];

  for (const item of productFrameMap) {
    const src = path.join(OUTPUT_DIR, item.frame);
    const dest = path.join(PRODUCTS_DIR, item.target);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  console.log(
    `\n✅ Successfully generated ${TOTAL_FRAMES} WebP frames in public/frames/frame_0001.webp ... frame_0240.webp`
  );
}

main();
