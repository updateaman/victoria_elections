export const site = {
	title: 'Victorian Election 2026 – Party Pledges Compared',
	description:
		'A neutral, source-linked comparison of election pledges from parties contesting the 2026 Victorian state election.',
	electionDate: '2026-11-28',
	dataLastVerified: '2026-11-20',
	// TODO: replace before publishing – see PLAN.md task 3.1 (Electoral Act authorisation).
	authorisation: 'Authorised by [NAME], [ADDRESS].',
	errorReportUrl: 'https://github.com/updateaman/victoria_elections/issues/new',
	sourceRepoUrl: 'https://github.com/updateaman/victoria_elections',
};

// Astro's BASE_URL may or may not include a trailing slash depending on `trailingSlash`.
export const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export function href(path: string): string {
	return `${base}${path.replace(/^\//, '')}`;
}

export function formatDate(iso: string): string {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-AU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	});
}
