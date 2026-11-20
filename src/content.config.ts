import { defineCollection, reference } from 'astro:content';
import { file } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

/**
 * Loads every `*.json` file in a directory, where each file holds an array of
 * entries with unique `id`s (e.g. one file per party), into a single collection.
 */
function jsonArrayDirLoader(dir: string): Loader {
	return {
		name: 'json-array-dir-loader',
		load: async ({ store, parseData, logger, config, watcher }) => {
			const absDir = fileURLToPath(new URL(dir, config.root));

			const loadAll = async () => {
				store.clear();
				let files: string[] = [];
				try {
					files = (await readdir(absDir)).filter((f) => f.endsWith('.json'));
				} catch {
					logger.warn(`Directory not found: ${dir}`);
					return;
				}
				for (const fileName of files) {
					const filePath = path.join(absDir, fileName);
					const entries: unknown = JSON.parse(await readFile(filePath, 'utf-8'));
					if (!Array.isArray(entries)) {
						throw new Error(`${dir}/${fileName} must contain a JSON array`);
					}
					for (const raw of entries) {
						const id = (raw as { id?: unknown }).id;
						if (typeof id !== 'string') {
							throw new Error(`Entry without string "id" in ${dir}/${fileName}`);
						}
						if (store.has(id)) {
							throw new Error(`Duplicate id "${id}" in ${dir}/${fileName}`);
						}
						const data = await parseData({ id, data: raw as Record<string, unknown>, filePath });
						store.set({ id, data, filePath: path.relative(fileURLToPath(config.root), filePath) });
					}
				}
			};

			await loadAll();

			watcher?.add(absDir);
			watcher?.on('all', async (_event, changed) => {
				if (changed.startsWith(absDir)) await loadAll();
			});
		},
	};
}

const parties = defineCollection({
	loader: file('src/data/parties.json'),
	schema: z.object({
		id: z.string(),
		name: z.string(),
		shortName: z.string(),
		colour: z.string().regex(/^#[0-9a-fA-F]{6}$/),
		logo: z.string().optional(),
		website: z.url(),
		manifestoUrl: z.url(),
		manifestoPdf: z.url().optional(),
		archiveUrl: z.url().optional(),
		lastVerified: isoDate,
		limitedInformation: z.boolean().default(false),
		notes: z.string().optional(),
		order: z.number().int().default(100),
	}),
});

const topics = defineCollection({
	loader: file('src/data/topics.json'),
	schema: z.object({
		id: z.string(),
		name: z.string(),
		description: z.string(),
		order: z.number().int(),
	}),
});

const pledges = defineCollection({
	loader: jsonArrayDirLoader('./src/data/pledges/'),
	schema: z.object({
		id: z.string(),
		party: reference('parties'),
		// Other parties that share this pledge (e.g. joint Liberal/Nationals commitments).
		jointWith: z.array(reference('parties')).default([]),
		topic: reference('topics'),
		title: z.string(),
		summary: z.string(),
		costing: z.string().optional(),
		costingSource: z.url().optional(),
		sourceUrl: z.url(),
		sourceTitle: z.string(),
		archiveUrl: z.url().optional(),
		excerpt: z.string().optional(),
		announcedDate: isoDate.optional(),
		dateAccessed: isoDate,
	}),
});

export const collections = { parties, topics, pledges };
