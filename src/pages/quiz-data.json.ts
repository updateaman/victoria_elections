import type { APIRoute } from 'astro';
import { loadData } from '../lib/data';
import { href } from '../lib/site';

// Client-side data for the priorities quiz. Counts include joint pledges for both parties.
export const GET: APIRoute = async () => {
	const { parties, topics, pledges } = await loadData();
	const topicIds = topics.map((t) => t.id);

	const data = {
		topics: topics.map((t) => ({ id: t.id, name: t.data.name })),
		parties: parties.map((p) => {
			const own = pledges.filter((pl) => pl.partyData.id === p.id || pl.jointParties.some((j) => j.id === p.id));
			const counts = Object.fromEntries(topicIds.map((id) => [id, own.filter((pl) => pl.topicData.id === id).length]));
			return {
				id: p.id,
				name: p.data.shortName,
				colour: p.data.colour,
				counts,
				total: own.length,
			};
		}),
		pledges: pledges.map((pl) => ({
			id: pl.id,
			partyIds: [pl.partyData.id, ...pl.jointParties.map((j) => j.id)],
			party: pl.partyData.data.shortName,
			topicId: pl.topicData.id,
			title: pl.title,
			url: `${href(`parties/${pl.partyData.id}/`)}#${pl.anchor}`,
		})),
	};

	return new Response(JSON.stringify(data), {
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});
};
