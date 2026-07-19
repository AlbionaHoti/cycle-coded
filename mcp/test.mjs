import test from "node:test";
import assert from "node:assert/strict";
import { computeCycle, buildHeader } from "./server.mjs";

test("menstrual early days", () => {
  const state = {
    lastPeriodStart: "2026-07-01",
    avgCycleLength: 28,
    modes: {},
  };
  const c = computeCycle(state, new Date(Date.UTC(2026, 6, 2)));
  assert.equal(c.phase, "menstrual");
  assert.equal(c.dayInCycle, 2);
});

test("follicular mid", () => {
  const state = {
    lastPeriodStart: "2026-07-01",
    avgCycleLength: 28,
    modes: {},
  };
  const c = computeCycle(state, new Date(Date.UTC(2026, 6, 10)));
  assert.equal(c.phase, "follicular");
});

test("ovulatory around mid cycle", () => {
  const state = {
    lastPeriodStart: "2026-07-01",
    avgCycleLength: 28,
    modes: {},
  };
  const c = computeCycle(state, new Date(Date.UTC(2026, 6, 15)));
  assert.equal(c.phase, "ovulatory");
});

test("luteal late", () => {
  const state = {
    lastPeriodStart: "2026-07-01",
    avgCycleLength: 28,
    modes: {},
  };
  const c = computeCycle(state, new Date(Date.UTC(2026, 6, 25)));
  assert.equal(c.phase, "luteal");
});

test("header stacks modes", () => {
  const state = {
    lastPeriodStart: "2026-07-01",
    avgCycleLength: 28,
    modes: { "mercury-retrograde": true, "girl-math": true },
  };
  const c = computeCycle(state, new Date(Date.UTC(2026, 6, 25)));
  const h = buildHeader(state, c);
  assert.match(h, /luteal/);
  assert.match(h, /mercury retrograde/);
  assert.match(h, /girl math/);
});

test("unconfigured", () => {
  const c = computeCycle({ lastPeriodStart: null, avgCycleLength: 28, modes: {} });
  assert.equal(c.configured, false);
});
