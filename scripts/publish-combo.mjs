import { readJson, writeJson, getNowIso } from "./shared.mjs";

const draft = readJson("data/generated/draft-combo.json");

if (!draft.combo_id) {
  console.error("No valid draft combo found. Run npm run generate:combo first.");
  process.exit(1);
}

const now = getNowIso();
const published = {
  ...draft,
  status: "published",
  updated_at: now,
  published_at: now
};

const history = readJson("data/generated/combo-history.json");
const historyEntry = {
  combo_id: published.combo_id,
  generated_at: published.generated_at,
  published_at: published.published_at,
  destination: published.destination,
  status: published.status,
  source_log: published.source_log
};

writeJson("data/generated/daily-combo.json", published);
writeJson("data/generated/combo-history.json", [historyEntry, ...history].slice(0, 60));

console.log(`Published combo: ${published.title}.`);
