// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages: derive site/base from the repository when building in GitHub Actions.
// Set SITE_URL (and leave BASE_PATH empty) if a custom domain is configured later.
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserSite = repo && repo.toLowerCase() === `${owner?.toLowerCase()}.github.io`;

const site = process.env.SITE_URL ?? (owner ? `https://${owner.toLowerCase()}.github.io` : 'http://localhost:4321');
const base = process.env.BASE_PATH ?? (repo && !isUserSite ? `/${repo}` : '/');

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'ignore',
});
