import type { APIRoute } from 'astro';
import { loadData } from '../lib/data';
import { href } from '../lib/site';

export const GET: APIRoute = async () => {
	const { pledges } = await loadData();
	const index = pledges.map((p) => ({
		id: p.id,
		title: p.title,
		summary: p.summary,
		costing: p.costing ?? null,
		party: p.partyData.data.shortName,
		partyId: p.partyData.id,
		partyIds: [p.partyData.id, ...p.jointParties.map((j) => j.id)],
		topic: p.topicData.data.name,
		topicId: p.topicData.id,
		sharedWith: p.jointParties.map((j) => j.data.shortName),
		sourceUrl: p.sourceUrl,
		sourceTitle: p.sourceTitle,
		url: `${href(`parties/${p.partyData.id}/`)}#${p.anchor}`,
	}));
	return new Response(JSON.stringify(index), {
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});
};
