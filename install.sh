#!/usr/bin/env bash
# cycle-coded — ONE command install for every agent on this machine.
# Usage (from anywhere after clone, or via bootstrap):
#   bash install.sh
#
# Does not upload data. Does not touch period state unless you import Health separately.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SKILL_SRC="$ROOT/skills/cycle-coded"
UNIVERSAL="$ROOT/instructions/UNIVERSAL.md"
ONE_PROMPT="$ROOT/instructions/ONE_PROMPT.md"

ok()  { echo "  ✓ $*"; }
skip(){ echo "  · $*"; }
warn(){ echo "  ! $*"; }

install_link() {
  local dest_parent="$1"
  local name="$2"
  mkdir -p "$dest_parent"
  local dest="$dest_parent/$name"
  if [[ -e "$dest" || -L "$dest" ]]; then
    rm -rf "$dest"
  fi
  ln -sfn "$SKILL_SRC" "$dest"
  ok "$dest"
}

echo ""
echo "  ♡ cycle-coded — single install"
echo ""

# ── 1) Skill links (Claude Code, Codex, open Agent Skills standard) ──
echo "  skills"
install_link "${HOME}/.agents/skills" "cycle-coded"
install_link "${HOME}/.claude/skills" "cycle-coded"
install_link "${ROOT}/.agents/skills" "cycle-coded"

# Cursor global rules (optional user-level)
if [[ -d "${HOME}/.cursor" ]]; then
  mkdir -p "${HOME}/.cursor/rules"
  if [[ -f "${ROOT}/.cursor/rules/cycle-coded.mdc" ]]; then
    ln -sfn "${ROOT}/.cursor/rules/cycle-coded.mdc" "${HOME}/.cursor/rules/cycle-coded.mdc"
    ok "${HOME}/.cursor/rules/cycle-coded.mdc"
  fi
fi

# ── 2) Plugins (best-effort; never fail the install) ──
echo ""
echo "  plugins (best-effort)"
if command -v claude >/dev/null 2>&1; then
  claude plugin marketplace add "$ROOT" >/dev/null 2>&1 && ok "claude marketplace: $ROOT" || skip "claude marketplace (run manually if needed)"
  claude plugin install cycle-coded@cycle-coded >/dev/null 2>&1 && ok "claude plugin install" || skip "claude plugin install (open CC and /plugin if needed)"
else
  skip "claude CLI not found"
fi

if command -v codex >/dev/null 2>&1; then
  codex plugin marketplace add AlbionaHoti/cycle-coded --ref main >/dev/null 2>&1 && ok "codex marketplace" || skip "codex marketplace"
  codex plugin add cycle-coded@cycle-coded >/dev/null 2>&1 && ok "codex plugin" || skip "codex plugin"
else
  skip "codex CLI not found"
fi

if command -v npx >/dev/null 2>&1; then
  # skills.sh multi-agent installer — non-interactive best-effort
  npx --yes skills add AlbionaHoti/cycle-coded --skill cycle-coded >/dev/null 2>&1 \
    && ok "npx skills add" \
    || skip "npx skills add (optional)"
else
  skip "npx not found"
fi

# ── 3) One paste prompt for web UIs ──
echo ""
echo "  web prompt"
if [[ -f "$UNIVERSAL" ]]; then
  {
    echo "# cycle-coded — activate this mode"
    echo ""
    cat "$UNIVERSAL"
    echo ""
    echo "---"
    echo "When I paste a header like \`ovulatory · day 13 · post it\`, use it as my live mode."
    echo "Start every reply with that header. Not medical advice."
  } > "$ONE_PROMPT"
  ok "wrote $ONE_PROMPT"
  # also drop a short path people can cat | pbcopy
  ok "web UIs: cat instructions/ONE_PROMPT.md | pbcopy"
else
  warn "UNIVERSAL.md missing"
fi

echo ""
echo "  ────────────────────────────────────────"
echo "  DONE. One skill is linked for agents on this Mac."
echo ""
echo "  Use it:"
echo "    Claude Code   →  /cycle-coded   or say: I'm luteal"
echo "    Codex         →  \$cycle-coded  or say: use cycle-coded"
echo "    Cursor        →  open this repo (rules included)"
echo "    ChatGPT/Gemini/Grok → paste ONE_PROMPT.md as system/custom instructions"
echo ""
echo "  Optional (local phase from Apple Health):"
echo "    node \"$ROOT/mcp/server.mjs\" get"
echo "  ────────────────────────────────────────"
echo ""
