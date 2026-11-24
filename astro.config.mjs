// @ts-check
import { defineConfig } from 'astro/config';

// Set SITE_URL to the deployed origin and BASE_PATH to its path prefix (use "/" for a root domain).
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'ignore',
});
