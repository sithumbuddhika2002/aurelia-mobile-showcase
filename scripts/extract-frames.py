#!/usr/bin/env python3
"""
AURELIA STUDIO — Video-to-WebP Frame Sequence Extractor (Python Edition)
------------------------------------------------------------------------
Takes 4 MP4 scene videos (scene1.mp4, scene2.mp4, scene3.mp4, scene4.mp4),
concatenates them with smooth 0.3s crossfades (xfade), and extracts
240 crisp WebP frames (fps=24, quality=90) into:
  public/frames/frame_0001.webp ... public/frames/frame_0240.webp
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "public" / "frames"
PRODUCTS_DIR = ROOT_DIR / "public" / "products"

INPUT_VIDEOS = [
    ROOT_DIR / "scene1.mp4",
    ROOT_DIR / "scene2.mp4",
    ROOT_DIR / "scene3.mp4",
    ROOT_DIR / "scene4.mp4",
]

TOTAL_FRAMES = 240
TARGET_FPS = 24
TOTAL_DURATION = TOTAL_FRAMES / TARGET_FPS  # 10.0s
CROSSFADE_DURATION = 0.3
WEBP_QUALITY = 90


def get_video_duration(file_path: Path) -> float:
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(file_path),
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        return float(result.stdout.strip())
    except Exception:
        return 10.0


def main() -> None:
    for video in INPUT_VIDEOS:
        if not video.exists():
            print(f"Missing input video: {video}", file=sys.stderr)
            sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)

    scene_target_duration = (
        TOTAL_DURATION + (len(INPUT_VIDEOS) - 1) * CROSSFADE_DURATION
    ) / len(INPUT_VIDEOS)

    durations = [get_video_duration(v) for v in INPUT_VIDEOS]
    filter_parts = []
    for i, orig_dur in enumerate(durations):
        pts_factor = scene_target_duration / orig_dur
        filter_parts.append(
            f"[{i}:v]scale=1920:1080:force_original_aspect_ratio=increase,"
            f"crop=1920:1080,setpts={pts_factor:.6f}*PTS,fps={TARGET_FPS},"
            f"format=yuv420p,setsar=1[v{i}]"
        )

    offset1 = scene_target_duration - CROSSFADE_DURATION
    offset2 = 2 * scene_target_duration - 2 * CROSSFADE_DURATION
    offset3 = 3 * scene_target_duration - 3 * CROSSFADE_DURATION

    filter_parts.extend(
        [
            f"[v0][v1]xfade=transition=fade:duration={CROSSFADE_DURATION}:offset={offset1:.4f}[xf1]",
            f"[xf1][v2]xfade=transition=fade:duration={CROSSFADE_DURATION}:offset={offset2:.4f}[xf2]",
            f"[xf2][v3]xfade=transition=fade:duration={CROSSFADE_DURATION}:offset={offset3:.4f},fps={TARGET_FPS}[outv]",
        ]
    )

    output_pattern = str(OUTPUT_DIR / "frame_%04d.webp")
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(INPUT_VIDEOS[0]),
        "-i",
        str(INPUT_VIDEOS[1]),
        "-i",
        str(INPUT_VIDEOS[2]),
        "-i",
        str(INPUT_VIDEOS[3]),
        "-filter_complex",
        ";".join(filter_parts),
        "-map",
        "[outv]",
        "-frames:v",
        str(TOTAL_FRAMES),
        "-c:v",
        "libwebp",
        "-lossless",
        "0",
        "-compression_level",
        "4",
        "-q:v",
        str(WEBP_QUALITY),
        "-start_number",
        "1",
        output_pattern,
    ]

    subprocess.run(cmd, check=True)

    generated = sorted(OUTPUT_DIR.glob("frame_*.webp"))
    if 0 < len(generated) < TOTAL_FRAMES:
        last_frame = generated[-1]
        for idx in range(len(generated) + 1, TOTAL_FRAMES + 1):
            shutil.copyfile(last_frame, OUTPUT_DIR / f"frame_{idx:04d}.webp")

    print(f"Successfully generated {TOTAL_FRAMES} frames in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
