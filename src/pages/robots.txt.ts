import type { APIRoute } from 'astro';
import { href } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
	const origin = site ?? new URL('http://localhost:4321');
	const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL(href('sitemap.xml'), origin).href}\n`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' },
	});
};
