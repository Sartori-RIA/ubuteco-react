import fs from "node:fs";
import path from "node:path";

const summaryPath = path.resolve("coverage/coverage-summary.json");
const badgePath = path.resolve(".github/badges/coverage.json");

const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
const pct = summary.total.lines.pct;

function coverageColor(value) {
  if (value >= 80) return "brightgreen";
  if (value >= 60) return "green";
  if (value >= 40) return "yellow";
  return "orange";
}

const badge = {
  schemaVersion: 1,
  label: "coverage",
  message: `${pct.toFixed(1)}%`,
  color: coverageColor(pct),
};

fs.mkdirSync(path.dirname(badgePath), {recursive: true});
fs.writeFileSync(badgePath, `${JSON.stringify(badge, null, 2)}\n`);

console.log(`Coverage badge updated: ${badge.message}`);
