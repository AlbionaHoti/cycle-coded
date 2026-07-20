#!/usr/bin/env bash
# ONE LINE install from anywhere:
#   curl -fsSL https://raw.githubusercontent.com/AlbionaHoti/cycle-coded/main/scripts/bootstrap.sh | bash
#
# Or:
#   git clone https://github.com/AlbionaHoti/cycle-coded ./cycle-coded && cd cycle-coded && bash install.sh
set -euo pipefail

REPO="${CYCLE_CODED_REPO:-https://github.com/AlbionaHoti/cycle-coded}"
DIR="${CYCLE_CODED_DIR:-$HOME/cycle-coded}"

echo "  ♡ cycle-coded bootstrap → $DIR"

if [[ -d "$DIR/.git" ]]; then
  echo "  · repo exists, pulling…"
  git -C "$DIR" pull --ff-only || true
else
  git clone "$REPO" "$DIR"
fi

bash "$DIR/install.sh"
