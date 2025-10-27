<script lang="ts">
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import type { HeadingItem } from './stores';

	interface Props {
		children: any;
		onHeadingsExtracted?: (headings: HeadingItem[]) => void;
	}

	let { children, onHeadingsExtracted } = $props();

	// Re-extract headings when the route changes
	$effect.pre(() => {
		// Access page to trigger effect when route changes
		const _ = $page.url.pathname;

		// Wait for next tick and then extract headings
		tick().then(() => {
			// Extract headings from the rendered content (only from prose content, not sidebar)
			const contentDiv = document.querySelector('.prose');
			if (!contentDiv) return;

			const headingsList: HeadingItem[] = [];
			let h2Index = 0;
			let h3Index = 0;

			// Find all h2 and h3 elements in the prose content only
			const elements = contentDiv.querySelectorAll('h2, h3');
			elements.forEach((el) => {
				if (el.tagName === 'H2') {
					h2Index++;
					h3Index = 0;
					const id = `heading-${h2Index}`;
					el.id = id;
					headingsList.push({
						id,
						level: 2,
						text: el.textContent || ''
					});
				} else if (el.tagName === 'H3') {
					h3Index++;
					const id = `heading-${h2Index}-${h3Index}`;
					el.id = id;
					headingsList.push({
						id,
						level: 3,
						text: el.textContent || ''
					});
				}
			});

			onHeadingsExtracted?.(headingsList);
		});
	});

	// Force theme application after mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			// Add a small delay to ensure DOM is ready
			setTimeout(() => {
				const isDark = document.documentElement.classList.contains('dark');
				const proseElement = document.querySelector('.prose');
				if (proseElement) {
					if (isDark) {
						proseElement.style.color = 'rgb(226, 232, 240)';
					} else {
						proseElement.style.color = 'rgb(55, 65, 81)';
					}
					console.log('Theme applied:', isDark ? 'dark' : 'light');
				}
			}, 100);
		}
	});
</script>

<div class="prose prose-lg max-w-none" style="color: rgb(55, 65, 81);">
	{@render children?.()}
</div>

<style>
	:global(.prose) {
		--tw-prose-body: rgb(55 65 81);
		--tw-prose-headings: rgb(17 24 39);
		--tw-prose-lead: rgb(55 65 81);
		--tw-prose-links: rgb(37 99 235);
		--tw-prose-bold: rgb(17 24 39);
		--tw-prose-counters: rgb(100 116 139);
		--tw-prose-bullets: rgb(203 213 225);
		--tw-prose-hr: rgb(226 232 240);
		--tw-prose-quotes: rgb(17 24 39);
		--tw-prose-quote-borders: rgb(226 232 240);
		--tw-prose-captions: rgb(100 116 139);
		--tw-prose-code: rgb(225 29 72);
		--tw-prose-pre-code: rgb(248 250 252);
		--tw-prose-pre-bg: rgb(15 23 42);
		--tw-prose-th-borders: rgb(203 213 225);
		--tw-prose-td-borders: rgb(226 232 240);

		/* Explicit light mode colors */
		color: rgb(55 65 81);
		background-color: transparent;
	}

	:global(.dark .prose) {
		--tw-prose-body: rgb(226 232 240);
		--tw-prose-headings: rgb(248 250 252);
		--tw-prose-lead: rgb(203 213 225);
		--tw-prose-links: rgb(129 140 248);
		--tw-prose-bold: rgb(248 250 252);
		--tw-prose-counters: rgb(203 213 225);
		--tw-prose-bullets: rgb(148 163 184);
		--tw-prose-hr: rgb(75 85 99);
		--tw-prose-quotes: rgb(248 250 252);
		--tw-prose-quote-borders: rgb(75 85 99);
		--tw-prose-captions: rgb(203 213 225);
		--tw-prose-code: rgb(167 243 208);
		--tw-prose-pre-code: rgb(241 245 249);
		--tw-prose-pre-bg: rgb(17 24 39);
		--tw-prose-th-borders: rgb(75 85 99);
		--tw-prose-td-borders: rgb(75 85 99);

		/* Explicit dark mode colors */
		color: rgb(226 232 240);
		background-color: transparent;
	}

	:global(.prose h1) {
		font-size: 3rem;
		font-weight: 800;
		line-height: 1.2;
		margin-top: 0;
		margin-bottom: 2rem;
		letter-spacing: -0.025em;
		color: rgb(17 24 39) !important;
	}

	:global(.dark .prose h1) {
		color: rgb(248 250 252) !important;
	}

	:global(.prose h2) {
		font-size: 1.875rem;
		font-weight: 700;
		line-height: 1.3;
		margin-top: 4rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--tw-prose-hr);
		letter-spacing: -0.025em;
		color: rgb(17 24 39) !important;
	}

	:global(.dark .prose h2) {
		color: rgb(248 250 252) !important;
	}

	:global(.prose h3) {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.4;
		margin-top: 3rem;
		margin-bottom: 1rem;
		letter-spacing: -0.025em;
		color: rgb(17 24 39) !important;
	}

	:global(.dark .prose h3) {
		color: rgb(248 250 252) !important;
	}

	:global(.prose h4) {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.4;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	:global(.prose p) {
		margin-bottom: 1.25rem;
		line-height: 1.7;
		color: rgb(55 65 81) !important;
	}

	:global(.dark .prose p) {
		color: rgb(226 232 240) !important;
	}

	:global(.prose code) {
		background-color: rgb(241 245 249);
		padding: 0.125rem 0.375rem;
		border-radius: 0.375rem;
		font-size: 0.875em;
		font-weight: 500;
	}

	:global(.dark .prose code) {
		background-color: rgb(55 65 81);
		color: rgb(167 243 208);
	}

	:global(.prose pre) {
		background-color: var(--tw-prose-pre-bg);
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin: 1.5rem 0;
		overflow-x: auto;
		border: 1px solid var(--tw-prose-hr);
	}

	:global(.prose pre code) {
		background-color: transparent;
		color: var(--tw-prose-pre-code);
		padding: 0;
		border-radius: 0;
	}

	:global(.prose blockquote) {
		border-left: 4px solid rgb(99 102 241);
		background-color: rgb(248 250 252);
		padding: 1rem 1.5rem;
		margin: 1.5rem 0;
		border-radius: 0 0.5rem 0.5rem 0;
		font-style: italic;
	}

	:global(.dark .prose blockquote) {
		background-color: rgba(55, 65, 81, 0.6);
		border-left-color: rgb(129 140 248);
		color: rgb(226 232 240);
	}

	:global(.prose ul),
	:global(.prose ol) {
		margin: 1.25rem 0;
		padding-left: 1.5rem;
	}

	:global(.prose li) {
		margin: 0.5rem 0;
		line-height: 1.7;
	}

	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin: 2rem 0;
		border: 1px solid var(--tw-prose-th-borders);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	:global(.prose th) {
		background-color: rgb(248 250 252);
		padding: 0.75rem 1rem;
		text-align: left;
		font-weight: 600;
		border-bottom: 1px solid var(--tw-prose-th-borders);
		border-right: 1px solid var(--tw-prose-th-borders);
	}

	:global(.dark .prose th) {
		background-color: rgb(55 65 81);
		color: rgb(248 250 252);
		border-bottom-color: rgb(75 85 99);
		border-right-color: rgb(75 85 99);
	}

	:global(.prose td) {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--tw-prose-td-borders);
		border-right: 1px solid var(--tw-prose-td-borders);
	}

	:global(.prose th:last-child),
	:global(.prose td:last-child) {
		border-right: none;
	}

	:global(.prose tbody tr:last-child td) {
		border-bottom: none;
	}

	:global(.dark .prose td) {
		color: rgb(203 213 225);
		border-bottom-color: rgb(75 85 99);
		border-right-color: rgb(75 85 99);
	}
</style>
