const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT_DIR, "public", "cinematic-audio.mp3");

// Let's inspect the 4 audio streams and also synthesize an ultra-luxury cinematic ambient music track
console.log("Analyzing scene audio...");

try {
  // Convert scene audio to mp3 and check duration
  execFileSync("ffmpeg", [
    "-y",
    "-i", path.join(ROOT_DIR, "scene1.mp4"),
    "-i", path.join(ROOT_DIR, "scene2.mp4"),
    "-i", path.join(ROOT_DIR, "scene3.mp4"),
    "-i", path.join(ROOT_DIR, "scene4.mp4"),
    "-filter_complex",
    "[0:a][1:a]acrossfade=d=0.5[a1];[a1][2:a]acrossfade=d=0.5[a2];[a2][3:a]acrossfade=d=0.5[a3]",
    "-map", "[a3]",
    "-c:a", "libmp3lame",
    "-b:a", "256k",
    path.join(ROOT_DIR, "public", "scene-audio.mp3")
  ], { stdio: "inherit" });
  console.log("Created scene-audio.mp3");
} catch (e) {
  console.error("Error creating scene-audio.mp3:", e.message);
}
