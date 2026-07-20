/**
 * Local notification log + macOS banner for cycle-coded.
 * No network. All under ~/.cycle-coded/
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const STATE_DIR = process.env.CYCLE_CODED_HOME || path.join(os.homedir(), ".cycle-coded");
const NOTIFY_LOG = path.join(STATE_DIR, "notifications.jsonl");
const PREFS_FILE = path.join(STATE_DIR, "notify-prefs.json");

const DEFAULT_PREFS = {
  /** active = ask with preview; passive = log silently after confirm tool only */
  notify_mode: "active",
  /** always show preview block before cycle_notify */
  preview_mode: "always",
  /** fire macOS Notification Center */
  macos_banner: true,
  declines_this_session: 0,
};

export function loadNotifyPrefs() {
  try {
    if (!fs.existsSync(PREFS_FILE)) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...JSON.parse(fs.readFileSync(PREFS_FILE, "utf8")) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function saveNotifyPrefs(prefs) {
  fs.mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2) + "\n", { mode: 0o600 });
}

function escAppleScript(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** macOS Notification Center (local only) */
export function fireMacOSNotification({ title, subtitle, body }) {
  if (process.platform !== "darwin") {
    return { ok: false, skipped: true, reason: "not darwin" };
  }
  const script = `display notification "${escAppleScript(body || "")}" with title "${escAppleScript(title || "cycle-coded")}" subtitle "${escAppleScript(subtitle || "")}"`;
  const r = spawnSync("osascript", ["-e", script], { encoding: "utf8" });
  if (r.status !== 0) {
    return { ok: false, error: r.stderr || r.stdout || "osascript failed" };
  }
  return { ok: true, channel: "macos-notification" };
}

export function appendNotification(entry) {
  fs.mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  const row = {
    id: `ccn_${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    ...entry,
  };
  fs.appendFileSync(NOTIFY_LOG, JSON.stringify(row) + "\n", { mode: 0o600 });
  return row;
}

export function listNotifications(limit = 20) {
  try {
    if (!fs.existsSync(NOTIFY_LOG)) return [];
    const lines = fs.readFileSync(NOTIFY_LOG, "utf8").trim().split("\n").filter(Boolean);
    return lines
      .slice(-limit)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .reverse();
  } catch {
    return [];
  }
}

/**
 * Build Router-style preview block the agent must show the user.
 */
export function formatPreview({ oneliner, summary, tags, header, suggested_mode, kind }) {
  const tagStr = (tags || []).join(", ") || "(none)";
  return [
    "── cycle-coded notify preview ──",
    `Oneliner: ${oneliner}`,
    `Summary: ${summary}`,
    `Tags: ${tagStr}`,
    header ? `Header: ${header}` : null,
    suggested_mode ? `Suggested mode: ${suggested_mode}` : null,
    kind ? `Kind: ${kind}` : null,
    "───────────────────────────────",
    'Reply yes / "notify" / "log it" to confirm.',
    "Reply no / skip to drop. Nothing is written until you confirm.",
  ]
    .filter(Boolean)
    .join("\n");
}
