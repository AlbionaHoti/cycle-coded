#!/usr/bin/env bash
# Install cycle-coded skill into common agent skill directories on THIS machine.
# Does not upload data. Does not touch ~/.cycle-coded state.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SKILL_SRC="$ROOT/skills/cycle-coded"

install_link() {
  local dest_parent="$1"
  local name="$2"
  mkdir -p "$dest_parent"
  local dest="$dest_parent/$name"
  if [[ -e "$dest" || -L "$dest" ]]; then
    rm -rf "$dest"
  fi
  ln -s "$SKILL_SRC" "$dest"
  echo "  ✓ $dest"
}

echo ""
echo "  ♡ cycle-coded install (local skill links)"
echo ""

# Agent Skills open standard locations
install_link "${HOME}/.agents/skills" "cycle-coded"

# Claude Code user skills
install_link "${HOME}/.claude/skills" "cycle-coded"

# Codex often scans ~/.agents/skills (above) and project .agents/skills
install_link "${ROOT}/.agents/skills" "cycle-coded"

# Cursor project already has .cursor/rules/cycle-coded.mdc in repo

echo ""
echo "  Claude Code plugin (optional):"
echo "    claude plugin marketplace add \"$ROOT\""
echo "    claude plugin install cycle-coded@cycle-coded"
echo ""
echo "  Codex plugin (optional):"
echo "    codex plugin marketplace add AlbionaHoti/cycle-coded --ref main"
echo "    codex plugin add cycle-coded@cycle-coded"
echo ""
echo "  skills.sh (multi-agent, if you use it):"
echo "    npx skills add AlbionaHoti/cycle-coded --skill cycle-coded"
echo ""
echo "  Web / ChatGPT / Gemini / Grok:"
echo "    paste instructions/UNIVERSAL.md into custom instructions"
echo "    then paste your local header from: node mcp/server.mjs get"
echo ""
echo "  Your cycle data (optional, stays home):"
echo "    node \"$ROOT/mcp/server.mjs\" get"
echo ""
