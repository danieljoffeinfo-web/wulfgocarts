#!/usr/bin/env bash
#
# Re-encode a generated film for scroll scrubbing.
#
# Generated MP4s ship with sparse keyframes — fine for playback, terrible for
# seeking, because every currentTime write snaps to the nearest keyframe and
# the scrub judders. This forces every frame to be a keyframe (-g 1), which
# makes seeking exact at the cost of a larger file.
#
# Usage: ./scripts/encode-scrub.sh input.mp4 apps/web/public/hero/scrub.mp4

set -euo pipefail

IN="${1:?usage: encode-scrub.sh <input.mp4> <output.mp4>}"
OUT="${2:?usage: encode-scrub.sh <input.mp4> <output.mp4>}"

mkdir -p "$(dirname "$OUT")"

ffmpeg -y -i "$IN" \
  -an \
  -vf "scale=1920:-2:flags=lanczos" \
  -c:v libx264 \
  -profile:v high \
  -pix_fmt yuv420p \
  -crf 20 \
  -g 1 \
  -movflags +faststart \
  "$OUT"

# Poster frame — shown before the video decodes, and as the static fallback
# for visitors with prefers-reduced-motion.
ffmpeg -y -i "$IN" -vframes 1 -q:v 2 "${OUT%.*}-poster.jpg"

echo "Wrote $OUT and ${OUT%.*}-poster.jpg"
