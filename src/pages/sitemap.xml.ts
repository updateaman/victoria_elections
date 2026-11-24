import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { href, site as siteInfo } from '../lib/site';
import { loadData } from '../lib/data';

export const GET: APIRoute = async ({ site }) => {
	const { parties, topics } = await loadData();
	const candidates = await getCollection('candidates');
	const origin = site ?? new URL('http://localhost:4321');

	const paths = [
		'',
		'about/',
		'compare/',
		'search/',
		'quiz/',
		...parties.map((p) => `parties/${p.id}/`),
		...topics.map((t) => `topics/${t.id}/`),
		...candidates.map((c) => `candidates/${c.id}/`),
	];

	const urls = paths
		.map((path) => `  <url><loc>${new URL(href(path), origin).href}</loc><lastmod>${siteInfo.dataLastVerified}</lastmod></url>`)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml; charset=utf-8' },
	});
};
