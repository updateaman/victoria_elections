import { getCollection, type CollectionEntry } from 'astro:content';

export type Party = CollectionEntry<'parties'>;
export type Topic = CollectionEntry<'topics'>;
export type PledgeEntry = CollectionEntry<'pledges'>;

export type Pledge = PledgeEntry['data'] & {
	partyData: Party;
	topicData: Topic;
	jointParties: Party[];
	anchor: string;
};

export async function loadData() {
	const [parties, topics, pledgeEntries] = await Promise.all([
		getCollection('parties'),
		getCollection('topics'),
		getCollection('pledges'),
	]);

	parties.sort((a, b) => a.data.order - b.data.order);
	topics.sort((a, b) => a.data.order - b.data.order);

	const partyById = new Map(parties.map((p) => [p.id, p]));
	const topicById = new Map(topics.map((t) => [t.id, t]));

	const pledges: Pledge[] = pledgeEntries.map((entry) => {
		const d = entry.data;
		return {
			...d,
			partyData: partyById.get(d.party.id)!,
			topicData: topicById.get(d.topic.id)!,
			jointParties: (d.jointWith ?? []).map((j) => partyById.get(j.id)!).filter(Boolean),
			anchor: `pledge-${d.id}`,
		};
	});

	pledges.sort((a, b) => {
		const pa = a.partyData.data.order;
		const pb = b.partyData.data.order;
		if (pa !== pb) return pa - pb;
		const ta = a.topicData.data.order;
		const tb = b.topicData.data.order;
		return ta - tb || a.title.localeCompare(b.title);
	});

	const byParty = (partyId: string) => pledges.filter((p) => p.partyData.id === partyId || p.jointParties.some((j) => j.id === partyId));
	const byTopic = (topicId: string) => pledges.filter((p) => p.topicData.id === topicId);
	const party = (id: string) => partyById.get(id);
	const topic = (id: string) => topicById.get(id);

	return { parties, topics, pledges, party, topic, byParty, byTopic };
}
