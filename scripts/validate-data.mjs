// Cross-reference and quality checks for src/data that the content schemas don't cover.
// Usage: node scripts/validate-data.mjs
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve('src/data');
const read = (f) => JSON.parse(readFileSync(path.join(dataDir, f), 'utf8'));

const parties = read('parties.json');
const topics = read('topics.json');
const partyIds = new Set(parties.map((p) => p.id));
const topicIds = new Set(topics.map((t) => t.id));

const errors = [];
const warnings = [];
const seen = new Map();
const counts = {};

for (const file of readdirSync(path.join(dataDir, 'pledges')).filter((f) => f.endsWith('.json'))) {
	const pledges = read(path.join('pledges', file));
	const fileParty = file.replace(/\.json$/, '');
	if (!partyIds.has(fileParty)) errors.push(`${file}: no party with id "${fileParty}"`);

	for (const p of pledges) {
		const where = `${file} → ${p.id}`;
		if (seen.has(p.id)) errors.push(`${where}: duplicate id (also in ${seen.get(p.id)})`);
		seen.set(p.id, file);
		if (p.party !== fileParty) errors.push(`${where}: party "${p.party}" does not match file name`);
		if (!topicIds.has(p.topic)) errors.push(`${where}: unknown topic "${p.topic}"`);
		for (const j of p.jointWith ?? []) {
			if (!partyIds.has(j)) errors.push(`${where}: unknown jointWith party "${j}"`);
			if (j === p.party) errors.push(`${where}: jointWith includes own party`);
		}
		if (!p.id.startsWith(`${p.party}-`)) warnings.push(`${where}: id should start with "${p.party}-"`);
		if (p.title?.length > 80) warnings.push(`${where}: title longer than 80 chars`);
		if (p.excerpt?.length > 300) warnings.push(`${where}: excerpt longer than 300 chars`);

		counts[p.party] ??= {};
		counts[p.party][p.topic] = (counts[p.party][p.topic] ?? 0) + 1;
	}
}

console.table(
	Object.fromEntries(
		parties.map((p) => [p.id, Object.fromEntries([...topicIds].map((t) => [t, counts[p.id]?.[t] ?? 0]))]),
	),
);
for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(`${seen.size} pledges, ${warnings.length} warnings, ${errors.length} errors`);
process.exit(errors.length ? 1 : 0);
