<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ContentWrapper from '$lib/ContentWrapper.svelte';
	import type { HeadingItem } from '$lib/stores';

	const navGroups = [
		{
			title: 'Getting Started',
			items: [
				{ slug: 'introduction', label: 'Introduction' },
				{ slug: 'installation', label: 'Installation' },
				{ slug: 'basic-concepts', label: 'Basic Concepts' },
				{ slug: 'project-structure', label: 'Project Structure' }
			]
		},
		{
			title: 'Core Features',
			items: [
				{ slug: 'routing', label: 'Routing' },
				{ slug: 'components', label: 'Components' },
				{ slug: 'data-loading', label: 'Data Loading' },
				{ slug: 'configuration', label: 'Configuration' }
			]
		}
	];

	let mobileMenuOpen = $state(false);
	let headings = $state<HeadingItem[]>([]);
	let contentDiv: HTMLElement | null = null;
	let searchQuery = $state('');
	let searchResults = $state<Array<{ slug: string; label: string; category: string }>>([]);
	let showSearchResults = $state(false);
	let darkMode = $state(false);
	let activeHeadingId = $state<string>('');
	let { children } = $props();

	// Flatten all navigation items for search
	const allNavItems = navGroups.flatMap((group) =>
		group.items.map((item) => ({
			...item,
			category: group.title
		}))
	);

	// Initialize dark mode from localStorage on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('darkMode');
			if (stored !== null) {
				darkMode = stored === 'true';
			} else {
				// First visit - check system preference
				if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
					darkMode = true;
				} else {
					darkMode = false;
				}
			}
		}
	});

	// Update DOM and localStorage when darkMode changes
	$effect(() => {
		if (typeof window !== 'undefined') {
			if (darkMode) {
				document.documentElement.classList.add('dark');
				localStorage.setItem('darkMode', 'true');
			} else {
				document.documentElement.classList.remove('dark');
				localStorage.setItem('darkMode', 'false');
			}
		}
	});

	function toggleDarkMode() {
		darkMode = !darkMode;
		console.log('Dark mode toggled:', darkMode);
	}

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;

		if (searchQuery.trim() === '') {
			searchResults = [];
			showSearchResults = false;
			return;
		}

		// Filter navigation items based on search query
		searchResults = allNavItems
			.filter(
				(item) =>
					item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.category.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.slice(0, 8); // Limit to 8 results

		showSearchResults = true;
	}

	function handleSearchFocus() {
		if (searchQuery.trim() !== '') {
			showSearchResults = true;
		}
	}

	function handleSearchBlur() {
		// Delay hiding to allow clicking on results
		setTimeout(() => {
			showSearchResults = false;
		}, 150);
	}

	function selectSearchResult(slug: string) {
		showSearchResults = false;
		searchQuery = '';
		// Navigate to the selected page
		window.location.href = `/${slug}`;
	}

	function handleHeadingsExtracted(items: HeadingItem[]) {
		headings = items;
		// Set up intersection observer to track active heading
		if (typeof window !== 'undefined' && items.length > 0) {
			// Clean up existing scroll listener
			if (window.scrollCleanup) {
				window.scrollCleanup();
			}
			setupIntersectionObserver();
		}
	}

	function setupIntersectionObserver() {
		// Clear any existing observer
		if (window.headingObserver) {
			window.headingObserver.disconnect();
		}

		// Enhanced scroll-based detection
		if (contentDiv) {
			const handleScroll = () => {
				if (!contentDiv || headings.length === 0) return;

				const scrollTop = contentDiv.scrollTop;
				const clientHeight = contentDiv.clientHeight;
				const scrollHeight = contentDiv.scrollHeight;

				// Check if we're at the bottom
				const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
				if (isAtBottom) {
					activeHeadingId = headings[headings.length - 1].id;
					return;
				}

				// Find the heading that's currently most visible
				let bestHeading = '';
				let bestDistance = Infinity;

				headings.forEach((heading) => {
					const element = document.getElementById(heading.id);
					if (!element || !contentDiv) return;

					const rect = element.getBoundingClientRect();
					const containerRect = contentDiv.getBoundingClientRect();

					// Calculate distance from top of container (considering the offset)
					const distanceFromTop = rect.top - containerRect.top;

					// We want headings that are in view or just above the top
					if (distanceFromTop <= 150 && distanceFromTop > -200) {
						const score = Math.abs(distanceFromTop - 100); // Prefer headings ~100px from top
						if (score < bestDistance) {
							bestDistance = score;
							bestHeading = heading.id;
						}
					}
				});

				if (bestHeading) {
					activeHeadingId = bestHeading;
				}
			};

			contentDiv.addEventListener('scroll', handleScroll);

			// Initial call to set active heading
			handleScroll();

			// Store cleanup function
			window.scrollCleanup = () => {
				contentDiv?.removeEventListener('scroll', handleScroll);
			};
		}
	}

	function handleHeadingClick(event: MouseEvent, headingId: string) {
		event.preventDefault();

		if (!contentDiv) return;

		const element = document.getElementById(headingId);
		if (element) {
			// Scroll the content div to the element
			const elementTop = element.offsetTop;
			contentDiv.scrollTo({
				top: elementTop - 100, // Add some offset from the top
				behavior: 'smooth'
			});
		}
	}

	$effect(() => {
		mobileMenuOpen = false;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen flex-col bg-white dark:bg-gray-900">
	<!-- Top Navigation Bar -->
	<header
		class="border-b border-gray-200 bg-white px-4 py-3 md:px-6 dark:border-gray-700 dark:bg-gray-900"
	>
		<div class="flex items-center justify-between">
			<!-- Logo and Brand -->
			<div class="flex items-center space-x-4">
				<a href="/" class="flex items-center space-x-2">
					<svg class="h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 9.739s9-4.189 9-9.739V7l-10-5z" />
					</svg>
					<span class="text-xl font-bold text-gray-900 dark:text-white">SvelteKit</span>
				</a>
				<span class="text-sm text-gray-500 dark:text-gray-400">Docs</span>
			</div>

			<!-- Search Bar -->
			<div class="relative mx-8 max-w-lg flex-1">
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<input
						type="search"
						placeholder="Search documentation..."
						bind:value={searchQuery}
						oninput={handleSearch}
						onfocus={handleSearchFocus}
						onblur={handleSearchBlur}
						class="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm leading-5 placeholder-gray-500 focus:border-orange-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500"
					/>
				</div>

				<!-- Search Results Dropdown -->
				{#if showSearchResults && searchResults.length > 0}
					<div
						class="absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
					>
						{#each searchResults as result}
							<button
								type="button"
								onclick={() => selectSearchResult(result.slug)}
								class="w-full border-b border-gray-100 px-4 py-2 text-left last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
							>
								<div class="text-sm font-medium text-gray-900 dark:text-white">{result.label}</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">{result.category}</div>
							</button>
						{/each}
					</div>
				{:else if showSearchResults && searchQuery.trim() !== ''}
					<div
						class="absolute top-full right-0 left-0 z-50 mt-1 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-600 dark:bg-gray-800"
					>
						<div class="text-sm text-gray-500 dark:text-gray-400">
							No results found for "{searchQuery}"
						</div>
					</div>
				{/if}
			</div>

			<!-- Right side items -->
			<div class="flex items-center space-x-4">
				<!-- Dark Mode Toggle -->
				<button
					type="button"
					onclick={toggleDarkMode}
					class="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					aria-label="Toggle dark mode"
				>
					{#if darkMode}
						<!-- Sun icon for light mode -->
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					{:else}
						<!-- Moon icon for dark mode -->
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
							/>
						</svg>
					{/if}
				</button>

				<!-- Mobile menu button -->
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none focus:ring-inset md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label="Toggle mobile menu"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>
	</header>

	<!-- Main Layout Container -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar Navigation -->
		<aside
			class="fixed inset-y-0 left-0 z-40 w-56 overflow-y-auto border-r border-gray-200 bg-white transition-transform md:static md:z-auto md:translate-x-0 dark:border-gray-700 dark:bg-gray-900"
			class:translate-x-0={mobileMenuOpen}
			class:-translate-x-full={!mobileMenuOpen}
		>
			<div class="h-full overflow-y-auto px-4 py-8">
				<nav class="space-y-8">
					{#each navGroups as group}
						<div>
							<h3
								class="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400"
							>
								{group.title}
							</h3>
							<ul class="space-y-1">
								{#each group.items as item}
									<li>
										<a
											href="/{item.slug}"
											class="block px-3 py-2 text-sm transition-colors {$page.url.pathname ===
											`/${item.slug}`
												? 'font-semibold text-gray-900 dark:text-white'
												: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}"
										>
											{item.label}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</nav>
			</div>
		</aside>

		<!-- Mobile overlay -->
		{#if mobileMenuOpen}
			<button
				type="button"
				class="bg-opacity-50 fixed inset-0 z-30 bg-black md:hidden"
				onclick={() => (mobileMenuOpen = false)}
				aria-label="Close mobile menu"
			>
			</button>
		{/if}

		<!-- Main content -->
		<main class="flex-1 overflow-hidden">
			<div class="flex h-full border-l border-gray-200 dark:border-gray-700">
				<!-- Content -->
				<div
					bind:this={contentDiv}
					class="min-w-0 flex-1 overflow-y-auto bg-white px-6 py-8 lg:px-12 dark:bg-gray-900"
				>
					<ContentWrapper onHeadingsExtracted={handleHeadingsExtracted}>
						{@render children?.()}
					</ContentWrapper>
				</div>
				<!-- Right sidebar - On this page -->
				<aside
					class="hidden w-64 overflow-y-auto border-l border-gray-200 bg-white px-4 py-8 xl:block dark:border-gray-700 dark:bg-gray-900"
				>
					<div class="sticky top-0">
						<div class="mb-6">
							<h3
								class="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400"
							>
								On this page
							</h3>
							<nav>
								{#if headings.length > 0}
									<ul class="space-y-1">
										{#each headings as item (item.id)}
											<li>
												<button
													onclick={(e) => handleHeadingClick(e, item.id)}
													class="block w-full rounded-md px-3 py-2 text-left text-sm transition-colors {item.level ===
													2
														? activeHeadingId === item.id
															? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
															: 'font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white'
														: activeHeadingId === item.id
															? 'ml-3 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
															: 'ml-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'}"
												>
													{item.text}
												</button>
											</li>
										{/each}
									</ul>
								{:else}
									<p class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
										No headings found
									</p>
								{/if}
							</nav>
						</div>
					</div>
				</aside>
			</div>
		</main>
	</div>
</div>
