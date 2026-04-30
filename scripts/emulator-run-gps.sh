#!/usr/bin/env bash
# Simulates a ~1.6km running loop for the Android emulator.
# Usage: ./scripts/emulator-run-gps.sh [interval_seconds]
#   interval_seconds: time between GPS points (default: 10.5)
#
# Simulates running at 7 min/km (~8.6 km/h) around a park loop near
# Lianhua Hill Park (莲花山公园), Futian District, Shenzhen, China.
# Each step is ~25m. At 7 min/km (~2.38 m/s), 25m ≈ 10.5 seconds per step.

INTERVAL=${1:-10.5}

# Rectangular loop: SW corner 114.0550°E 22.5365°N
# ~500m east–west (20 steps), ~300m north–south (12 steps)
# Δlat ≈ 0.000225°/step (25m), Δlng ≈ 0.000244°/step (25m at lat 22.5°)
# Format: "longitude latitude"
POINTS=(
  # West side — going north
  "114.05500 22.53650"
  "114.05500 22.53673"
  "114.05500 22.53695"
  "114.05500 22.53718"
  "114.05500 22.53740"
  "114.05500 22.53763"
  "114.05500 22.53785"
  "114.05500 22.53808"
  "114.05500 22.53830"
  "114.05500 22.53853"
  "114.05500 22.53875"
  "114.05500 22.53898"
  "114.05500 22.53920"
  # North side — going east
  "114.05524 22.53920"
  "114.05549 22.53920"
  "114.05573 22.53920"
  "114.05598 22.53920"
  "114.05622 22.53920"
  "114.05646 22.53920"
  "114.05671 22.53920"
  "114.05695 22.53920"
  "114.05720 22.53920"
  "114.05744 22.53920"
  "114.05768 22.53920"
  "114.05793 22.53920"
  "114.05817 22.53920"
  "114.05842 22.53920"
  "114.05866 22.53920"
  "114.05890 22.53920"
  "114.05915 22.53920"
  "114.05939 22.53920"
  "114.05964 22.53920"
  "114.05988 22.53920"
  # East side — going south
  "114.05988 22.53898"
  "114.05988 22.53875"
  "114.05988 22.53853"
  "114.05988 22.53830"
  "114.05988 22.53808"
  "114.05988 22.53785"
  "114.05988 22.53763"
  "114.05988 22.53740"
  "114.05988 22.53718"
  "114.05988 22.53695"
  "114.05988 22.53673"
  "114.05988 22.53650"
  # South side — going west
  "114.05964 22.53650"
  "114.05939 22.53650"
  "114.05915 22.53650"
  "114.05890 22.53650"
  "114.05866 22.53650"
  "114.05842 22.53650"
  "114.05817 22.53650"
  "114.05793 22.53650"
  "114.05768 22.53650"
  "114.05744 22.53650"
  "114.05720 22.53650"
  "114.05695 22.53650"
  "114.05671 22.53650"
  "114.05646 22.53650"
  "114.05622 22.53650"
  "114.05598 22.53650"
  "114.05573 22.53650"
  "114.05549 22.53650"
  "114.05524 22.53650"
)

echo "Starting GPS simulation (~1.6km loop @ ~5 km/h, ${INTERVAL}s between points)"
echo "Location: Lianhua Hill Park area, Shenzhen, China"
echo "Press Ctrl+C to stop"
echo ""

LOOP=1
while true; do
  echo "Loop #$LOOP"
  for POINT in "${POINTS[@]}"; do
    LNG=$(echo "$POINT" | cut -d' ' -f1)
    LAT=$(echo "$POINT" | cut -d' ' -f2)
    echo "  → lat=$LAT lng=$LNG"
    adb emu geo fix "$LNG" "$LAT"
    sleep "$INTERVAL"
  done
  LOOP=$((LOOP + 1))
done
