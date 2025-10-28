import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(), 
		mdsvex({ 
			extensions: ['.md'],
			highlight: false // Completely disable syntax highlighting
		})
	],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			entries: [
				'/',
				'/basic-concepts',
				'/components',
				'/configuration',
				'/data-loading',
				'/installation',
				'/introduction',
				'/project-structure',
				'/routing'
			]
		}
	},
	extensions: ['.svelte', '.md']
};

export default config;
