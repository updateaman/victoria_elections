// @ts-check
import { defineConfig } from 'astro/config';

// Set SITE_URL to override the deployed origin and BASE_PATH to its path prefix (use "/" for a root domain).
const site = process.env.SITE_URL ?? 'https://vic-election-2026.netlify.app';
const base = process.env.BASE_PATH ?? '/';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'ignore',
});
