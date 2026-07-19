import test from "node:test";
import assert from "node:assert/strict";
import {
  periodStartsFromFlowDays,
  averageCycleLength,
  reviewSummary,
} from "./import-health.mjs";

test("groups consecutive flow days into period starts", () => {
  const flow = [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    // gap
    "2026-07-29",
    "2026-07-30",
    "2026-07-31",
  ];
  const starts = periodStartsFromFlowDays(flow);
  assert.deepEqual(starts, ["2026-07-01", "2026-07-29"]);
});

test("average cycle length from starts", () => {
  const starts = ["2026-01-01", "2026-01-29", "2026-02-26"]; // 28, 28
  assert.equal(averageCycleLength(starts), 28);
});

test("review summary", () => {
  const starts = ["2026-06-01", "2026-06-29", "2026-07-27"];
  const s = reviewSummary(starts, 28);
  assert.equal(s.periodCount, 3);
  assert.equal(s.lastPeriodStart, "2026-07-27");
  assert.equal(s.lastCycleLengthDays, 28);
});
